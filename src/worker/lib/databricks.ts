// Databricks SQL Statement Execution API Client
// https://docs.databricks.com/api/workspace/statementexecution

export type DatabricksConfig = {
  host: string;
  token: string;
  warehouseId: string;
};

export type StatementStatus = 
  | "PENDING" 
  | "RUNNING" 
  | "SUCCEEDED" 
  | "FAILED" 
  | "CANCELED" 
  | "CLOSED";

export type StatementResponse = {
  statement_id: string;
  status: {
    state: StatementStatus;
    error?: {
      error_code: string;
      message: string;
    };
  };
  manifest?: {
    format: string;
    schema: {
      column_count: number;
      columns: Array<{
        name: string;
        type_name: string;
        type_text: string;
        position: number;
      }>;
    };
    total_row_count: number;
    total_chunk_count: number;
  };
  result?: {
    row_count: number;
    data_array: unknown[][];
  };
};

export class DatabricksClient {
  private host: string;
  private token: string;
  private warehouseId: string;

  constructor(config: DatabricksConfig) {
    this.host = config.host.replace(/\/$/, ""); // Remove trailing slash
    this.token = config.token;
    this.warehouseId = config.warehouseId;
  }

  // Execute SQL and wait for result
  async executeSQL<T = Record<string, unknown>>(
    sql: string,
    params?: Record<string, unknown>
  ): Promise<T[]> {
    const response = await this.submitStatement(sql, params);
    
    if (response.status.state === "FAILED") {
      throw new Error(
        response.status.error?.message || "Databricks query failed"
      );
    }

    // If still running, poll for completion
    let result = response;
    while (result.status.state === "PENDING" || result.status.state === "RUNNING") {
      await this.delay(500);
      result = await this.getStatementStatus(result.statement_id);
    }

    if (result.status.state !== "SUCCEEDED") {
      throw new Error(
        result.status.error?.message || `Query ended with state: ${result.status.state}`
      );
    }

    return this.parseResult<T>(result);
  }

  // Submit SQL statement
  private async submitStatement(
    sql: string,
    params?: Record<string, unknown>
  ): Promise<StatementResponse> {
    const url = `${this.host}/api/2.0/sql/statements`;
    
    const body: Record<string, unknown> = {
      warehouse_id: this.warehouseId,
      statement: sql,
      wait_timeout: "30s",
      on_wait_timeout: "CONTINUE",
    };

    if (params) {
      body.parameters = Object.entries(params).map(([name, value]) => ({
        name,
        value: String(value),
      }));
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Databricks API error: ${response.status} - ${error}`);
    }

    return response.json() as Promise<StatementResponse>;
  }

  // Get statement status/result
  private async getStatementStatus(statementId: string): Promise<StatementResponse> {
    const url = `${this.host}/api/2.0/sql/statements/${statementId}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Databricks API error: ${response.status} - ${error}`);
    }

    return response.json() as Promise<StatementResponse>;
  }

  // Parse result into typed objects
  private parseResult<T>(response: StatementResponse): T[] {
    if (!response.manifest || !response.result) {
      return [];
    }

    const columns = response.manifest.schema.columns;
    const rows = response.result.data_array;

    return rows.map((row) => {
      const obj: Record<string, unknown> = {};
      columns.forEach((col, idx) => {
        obj[col.name] = this.parseValue(row[idx], col.type_name);
      });
      return obj as T;
    });
  }

  // Parse value based on column type
  private parseValue(value: unknown, typeName: string): unknown {
    if (value === null || value === undefined) {
      return null;
    }

    switch (typeName.toUpperCase()) {
      case "INT":
      case "BIGINT":
      case "SMALLINT":
      case "TINYINT":
        return Number(value);
      case "FLOAT":
      case "DOUBLE":
      case "DECIMAL":
        return parseFloat(String(value));
      case "BOOLEAN":
        return value === true || value === "true" || value === 1;
      case "DATE":
      case "TIMESTAMP":
        return String(value);
      default:
        return String(value);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Factory function to create client from environment
export function createDatabricksClient(env: {
  DATABRICKS_HOST: string;
  DATABRICKS_TOKEN: string;
  DATABRICKS_WAREHOUSE_ID: string;
}): DatabricksClient {
  return new DatabricksClient({
    host: env.DATABRICKS_HOST,
    token: env.DATABRICKS_TOKEN,
    warehouseId: env.DATABRICKS_WAREHOUSE_ID,
  });
}
