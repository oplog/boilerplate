// Form Template - Dahili uygulama gelistirici icin referans sablon
// Bu dosya, Claude Code ile yeni form sayfalari olustururken temel olarak kullanilir.
// Icerik: @tanstack/react-form + zod validasyon + shadcn/ui Field bilesenleri
// 3 bolum: Temel Bilgiler, Detaylar, Tercihler

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import { Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { PageHeader } from "@/components/shared/page-header";

// ─── Zod Validasyon Semasi ──────────────────────────────────────────────────

const formSchema = z.object({
  // Temel Bilgiler
  name: z.string().min(2, "Ad Soyad en az 2 karakter olmali"),
  email: z.string().email("Gecerli bir email adresi girin"),
  phone: z
    .string()
    .regex(/^(\+90|0)?[0-9]{10}$/, "Gecerli bir telefon numarasi girin")
    .or(z.literal("")),
  department: z.string().min(1, "Departman secimi zorunlu"),

  // Detaylar
  description: z
    .string()
    .max(500, "Aciklama en fazla 500 karakter olabilir")
    .optional()
    .or(z.literal("")),
  startDate: z.string().min(1, "Baslangic tarihi zorunlu"),
  priority: z.string().min(1, "Oncelik secimi zorunlu"),

  // Tercihler
  emailNotifications: z.boolean().default(true),
  terms: z.boolean().refine((val) => val === true, {
    message: "Kullanim kosullarini kabul etmeniz gerekiyor",
  }),
});

// ─── Sabit Veriler ──────────────────────────────────────────────────────────

const departments = [
  { value: "operasyon", label: "Operasyon" },
  { value: "finans", label: "Finans" },
  { value: "it", label: "IT" },
  { value: "ik", label: "IK" },
  { value: "lojistik", label: "Lojistik" },
];

const priorities = [
  { value: "dusuk", label: "Dusuk" },
  { value: "normal", label: "Normal" },
  { value: "yuksek", label: "Yuksek" },
  { value: "acil", label: "Acil" },
];

// ─── Form Template Sayfasi ──────────────────────────────────────────────────

export function FormTemplatePage() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      department: "",
      description: "",
      startDate: "",
      priority: "",
      emailNotifications: true,
      terms: false,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      console.log("Form verisi:", value);
      toast.success("Kayit basariyla olusturuldu!");
      form.reset();
    },
  });

  return (
    <div>
      <PageHeader
        title="Yeni Kayit"
        description="Yeni bir kayit olusturmak icin formu doldurun"
        actions={
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri
          </Button>
        }
      />

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Kayit Formu</CardTitle>
          <CardDescription>
            Yildizli (*) alanlar zorunludur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            {/* ─── Bolum 1: Temel Bilgiler ─────────────────── */}
            <div>
              <h3 className="text-base font-semibold">Temel Bilgiler</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Kisisel ve iletisim bilgilerinizi girin
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Ad Soyad */}
                <form.Field name="name">
                  {(field) => {
                    const hasError =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0;
                    return (
                      <Field data-invalid={hasError || undefined}>
                        <FieldLabel htmlFor={field.name}>
                          Ad Soyad *
                        </FieldLabel>
                        <Input
                          id={field.name}
                          placeholder="Adinizi girin"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={hasError}
                        />
                        {hasError && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                {/* Email */}
                <form.Field name="email">
                  {(field) => {
                    const hasError =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0;
                    return (
                      <Field data-invalid={hasError || undefined}>
                        <FieldLabel htmlFor={field.name}>Email *</FieldLabel>
                        <Input
                          id={field.name}
                          type="email"
                          placeholder="ornek@oplog.com"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={hasError}
                        />
                        {hasError && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                {/* Telefon */}
                <form.Field name="phone">
                  {(field) => {
                    const hasError =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0;
                    return (
                      <Field data-invalid={hasError || undefined}>
                        <FieldLabel htmlFor={field.name}>Telefon</FieldLabel>
                        <Input
                          id={field.name}
                          type="tel"
                          placeholder="05XX XXX XX XX"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={hasError}
                        />
                        <FieldDescription>Opsiyonel</FieldDescription>
                        {hasError && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                {/* Departman */}
                <form.Field name="department">
                  {(field) => {
                    const hasError =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0;
                    return (
                      <Field data-invalid={hasError || undefined}>
                        <FieldLabel htmlFor={field.name}>
                          Departman *
                        </FieldLabel>
                        <Select
                          value={field.state.value}
                          onValueChange={(val) => field.handleChange(val)}
                        >
                          <SelectTrigger id={field.name} onBlur={field.handleBlur}>
                            <SelectValue placeholder="Departman secin" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept.value} value={dept.value}>
                                {dept.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {hasError && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            </div>

            <Separator />

            {/* ─── Bolum 2: Detaylar ───────────────────────── */}
            <div>
              <h3 className="text-base font-semibold">Detaylar</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Kayit ile ilgili ek bilgileri girin
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Baslangic Tarihi */}
                <form.Field name="startDate">
                  {(field) => {
                    const hasError =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0;
                    return (
                      <Field data-invalid={hasError || undefined}>
                        <FieldLabel htmlFor={field.name}>
                          Baslangic Tarihi *
                        </FieldLabel>
                        <Input
                          id={field.name}
                          type="date"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={hasError}
                        />
                        {hasError && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                {/* Oncelik */}
                <form.Field name="priority">
                  {(field) => {
                    const hasError =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0;
                    return (
                      <Field data-invalid={hasError || undefined}>
                        <FieldLabel htmlFor={field.name}>
                          Oncelik *
                        </FieldLabel>
                        <Select
                          value={field.state.value}
                          onValueChange={(val) => field.handleChange(val)}
                        >
                          <SelectTrigger id={field.name} onBlur={field.handleBlur}>
                            <SelectValue placeholder="Oncelik secin" />
                          </SelectTrigger>
                          <SelectContent>
                            {priorities.map((p) => (
                              <SelectItem key={p.value} value={p.value}>
                                {p.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {hasError && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                {/* Aciklama (tam genislik) */}
                <form.Field name="description">
                  {(field) => {
                    const hasError =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0;
                    return (
                      <Field
                        data-invalid={hasError || undefined}
                        className="sm:col-span-2"
                      >
                        <div className="flex items-center justify-between">
                          <FieldLabel htmlFor={field.name}>
                            Aciklama
                          </FieldLabel>
                          <span className="text-xs text-muted-foreground">
                            {(field.state.value ?? "").length}/500
                          </span>
                        </div>
                        <Textarea
                          id={field.name}
                          placeholder="Ek bilgi veya aciklama yazin..."
                          rows={4}
                          value={field.state.value ?? ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={hasError}
                        />
                        <FieldDescription>
                          En fazla 500 karakter girebilirsiniz
                        </FieldDescription>
                        {hasError && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            </div>

            <Separator />

            {/* ─── Bolum 3: Tercihler ──────────────────────── */}
            <div>
              <h3 className="text-base font-semibold">Tercihler</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Bildirim ve kosul tercihlerinizi belirleyin
              </p>
              <div className="space-y-4">
                {/* Email Bildirimleri (Switch) */}
                <form.Field name="emailNotifications">
                  {(field) => (
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FieldLabel
                          htmlFor={field.name}
                          className="text-base"
                        >
                          Email Bildirimleri
                        </FieldLabel>
                        <FieldDescription>
                          Kayit durumu degistiginde email ile
                          bilgilendirilirsiniz
                        </FieldDescription>
                      </div>
                      <Switch
                        id={field.name}
                        checked={field.state.value}
                        onCheckedChange={field.handleChange}
                      />
                    </div>
                  )}
                </form.Field>

                {/* Kullanim Kosullari (Checkbox) */}
                <form.Field name="terms">
                  {(field) => {
                    const hasError =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0;
                    return (
                      <Field
                        data-invalid={hasError || undefined}
                        orientation="horizontal"
                        className="items-start gap-3"
                      >
                        <Checkbox
                          id={field.name}
                          checked={field.state.value}
                          onCheckedChange={(c) => field.handleChange(!!c)}
                        />
                        <div className="space-y-1 leading-none">
                          <FieldLabel htmlFor={field.name}>
                            Kullanim kosullarini kabul ediyorum *
                          </FieldLabel>
                          <FieldDescription>
                            Verileriniz guvenli sekilde saklanir ve yalnizca
                            belirtilen amaclar icin kullanilir.
                          </FieldDescription>
                          {hasError && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </div>
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            </div>

            {/* ─── Gonder Butonu ────────────────────────────── */}
            <div className="flex justify-end">
              <form.Subscribe selector={(s) => s.isSubmitting}>
                {(isSubmitting) => (
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
