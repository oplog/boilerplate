// Form ornegi sayfasi
// @tanstack/react-form + Zod validation
// Tum yaygin form alani turlerini gosterir: input, select, textarea, checkbox, switch, radio, slider
// Yeni form olustururken bu dosyayi referans olarak kullanabilirsin

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { PageHeader } from "@/components/shared/page-header";

// Form validation semasi
const formSchema = z.object({
  // Metin alanlari
  name: z.string().min(2, "Isim en az 2 karakter olmali"),
  email: z.string().email("Gecerli bir email adresi girin"),
  phone: z
    .string()
    .regex(/^(\+90|0)?[0-9]{10}$/, "Gecerli bir telefon numarasi girin")
    .or(z.literal("")),
  department: z.string().min(1, "Departman secimi zorunlu"),
  description: z.string().optional(),

  // Secim alanlari
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Oncelik secimi zorunlu",
  }),
  notifications: z.boolean().default(true),
  terms: z.boolean().refine((val) => val === true, {
    message: "Kosullari kabul etmeniz gerekiyor",
  }),

  // Sayisal alan
  satisfaction: z.number().min(0).max(10).default(5),
});

// Departman listesi
const departments = [
  { value: "operations", label: "Operasyon" },
  { value: "warehouse", label: "Depo" },
  { value: "logistics", label: "Lojistik" },
  { value: "finance", label: "Finans" },
  { value: "it", label: "Bilgi Teknolojileri" },
  { value: "hr", label: "Insan Kaynaklari" },
  { value: "support", label: "Musteri Destek" },
];

export function FormExamplePage() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      department: "",
      description: "",
      priority: "medium" as const,
      notifications: true,
      terms: false,
      satisfaction: 5,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await fetch("/api/examples", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: value.name,
            description: `${value.department} | ${value.priority} | ${value.email}`,
            status: "active",
          }),
        });

        if (!response.ok) throw new Error("Gonderim basarisiz");

        toast.success("Form basariyla gonderildi!", {
          description: `${value.name} kaydedildi.`,
        });

        form.reset();
      } catch {
        toast.error("Bir hata olustu", {
          description: "Lutfen tekrar deneyin.",
        });
      }
    },
  });

  return (
    <div>
      <PageHeader
        title="Form Ornegi"
        description="Tum form alani turlerini gosteren kapsamli form ornegi"
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Talep Formu</CardTitle>
          <CardDescription>
            Input, Select, Textarea, Checkbox, Switch, Radio ve Slider alanlarini icerir
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
            {/* ─── Kisisel Bilgiler ─────────────────── */}
            <div>
              <h3 className="mb-3 text-sm font-medium">Kisisel Bilgiler</h3>
              <div className="space-y-4">
                {/* Isim */}
                <form.Field name="name">
                  {(field) => {
                    const hasError =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0;
                    return (
                      <Field data-invalid={hasError || undefined}>
                        <FieldLabel htmlFor={field.name}>Isim *</FieldLabel>
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

                {/* Email ve Telefon yan yana */}
                <div className="grid gap-4 sm:grid-cols-2">
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

                  <form.Field name="phone">
                    {(field) => {
                      const hasError =
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0;
                      return (
                        <Field data-invalid={hasError || undefined}>
                          <FieldLabel htmlFor={field.name}>
                            Telefon
                          </FieldLabel>
                          <Input
                            id={field.name}
                            type="tel"
                            placeholder="05XX XXX XX XX"
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
                </div>

                {/* Departman (Select) */}
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

            {/* ─── Talep Detaylari ──────────────────── */}
            <div>
              <h3 className="mb-3 text-sm font-medium">Talep Detaylari</h3>
              <div className="space-y-4">
                {/* Oncelik (Radio Group) */}
                <form.Field name="priority">
                  {(field) => {
                    const hasError =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0;
                    return (
                      <Field data-invalid={hasError || undefined}>
                        <FieldLabel>Oncelik *</FieldLabel>
                        <RadioGroup
                          value={field.state.value}
                          onValueChange={field.handleChange}
                          className="flex gap-4"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="low" id="priority-low" />
                            <FieldLabel
                              htmlFor="priority-low"
                              className="font-normal"
                            >
                              Dusuk
                            </FieldLabel>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              value="medium"
                              id="priority-medium"
                            />
                            <FieldLabel
                              htmlFor="priority-medium"
                              className="font-normal"
                            >
                              Orta
                            </FieldLabel>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="high" id="priority-high" />
                            <FieldLabel
                              htmlFor="priority-high"
                              className="font-normal"
                            >
                              Yuksek
                            </FieldLabel>
                          </div>
                        </RadioGroup>
                        {hasError && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                {/* Aciklama (Textarea) */}
                <form.Field name="description">
                  {(field) => {
                    const hasError =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0;
                    return (
                      <Field data-invalid={hasError || undefined}>
                        <FieldLabel htmlFor={field.name}>Aciklama</FieldLabel>
                        <Textarea
                          id={field.name}
                          placeholder="Talebinizi detayli aciklayin..."
                          rows={4}
                          value={field.state.value ?? ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={hasError}
                        />
                        <FieldDescription>
                          Ne kadar detay verirseniz o kadar hizli cozum
                          uretilir.
                        </FieldDescription>
                        {hasError && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                {/* Memnuniyet (Slider) */}
                <form.Field name="satisfaction">
                  {(field) => (
                    <Field>
                      <div className="flex items-center justify-between">
                        <FieldLabel>Memnuniyet Puani</FieldLabel>
                        <span className="text-sm font-medium">
                          {field.state.value}/10
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={10}
                        step={1}
                        value={[field.state.value]}
                        onValueChange={([val]) => field.handleChange(val)}
                      />
                      <FieldDescription>
                        Genel memnuniyet puaninizi secin (0=cok kotu,
                        10=mukemmel)
                      </FieldDescription>
                    </Field>
                  )}
                </form.Field>
              </div>
            </div>

            <Separator />

            {/* ─── Tercihler ────────────────────────── */}
            <div>
              <h3 className="mb-3 text-sm font-medium">Tercihler</h3>
              <div className="space-y-4">
                {/* Bildirimler (Switch) */}
                <form.Field name="notifications">
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
                          Talep durumu degistiginde email al
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

                {/* Kosullar (Checkbox) */}
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
                            Verileriniz guvenli sekilde saklanir ve sadece talep
                            takibi icin kullanilir.
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

            {/* ─── Butonlar ─────────────────────────── */}
            <div className="flex gap-3">
              <form.Subscribe
                selector={(s) => s.isSubmitting}
              >
                {(isSubmitting) => (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Gonderiliyor..." : "Gonder"}
                  </Button>
                )}
              </form.Subscribe>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Temizle
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
