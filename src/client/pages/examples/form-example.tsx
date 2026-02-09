// Form örneği sayfası
// shadcn/ui Form + React Hook Form + Zod validation
// Tüm yaygın form alanı türlerini gösterir: input, select, textarea, checkbox, switch, radio, slider
// Yeni form oluştururken bu dosyayı referans olarak kullanabilirsin

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/page-header";

// Form validation şeması
const formSchema = z.object({
  // Metin alanları
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir email adresi girin"),
  phone: z
    .string()
    .regex(/^(\+90|0)?[0-9]{10}$/, "Geçerli bir telefon numarası girin")
    .or(z.literal("")),
  department: z.string().min(1, "Departman seçimi zorunlu"),
  description: z.string().optional(),

  // Seçim alanları
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Öncelik seçimi zorunlu",
  }),
  notifications: z.boolean().default(true),
  terms: z.boolean().refine((val) => val === true, {
    message: "Koşulları kabul etmeniz gerekiyor",
  }),

  // Sayısal alan
  satisfaction: z.number().min(0).max(10).default(5),
});

type FormValues = z.infer<typeof formSchema>;

// Departman listesi
const departments = [
  { value: "operations", label: "Operasyon" },
  { value: "warehouse", label: "Depo" },
  { value: "logistics", label: "Lojistik" },
  { value: "finance", label: "Finans" },
  { value: "it", label: "Bilgi Teknolojileri" },
  { value: "hr", label: "İnsan Kaynakları" },
  { value: "support", label: "Müşteri Destek" },
];

export function FormExamplePage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      department: "",
      description: "",
      priority: "medium",
      notifications: true,
      terms: false,
      satisfaction: 5,
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      const response = await fetch("/api/examples", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: `${data.department} | ${data.priority} | ${data.email}`,
          status: "active",
        }),
      });

      if (!response.ok) throw new Error("Gönderim başarısız");

      toast.success("Form başarıyla gönderildi!", {
        description: `${data.name} kaydedildi.`,
      });

      form.reset();
    } catch {
      toast.error("Bir hata oluştu", {
        description: "Lütfen tekrar deneyin.",
      });
    }
  }

  return (
    <div>
      <PageHeader
        title="Form Örneği"
        description="Tüm form alanı türlerini gösteren kapsamlı form örneği"
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Talep Formu</CardTitle>
          <CardDescription>
            Input, Select, Textarea, Checkbox, Switch, Radio ve Slider alanlarını içerir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* ─── Kişisel Bilgiler ─────────────────── */}
              <div>
                <h3 className="mb-3 text-sm font-medium">Kişisel Bilgiler</h3>
                <div className="space-y-4">
                  {/* İsim */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>İsim *</FormLabel>
                        <FormControl>
                          <Input placeholder="Adınızı girin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email ve Telefon yan yana */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="ornek@oplog.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="05XX XXX XX XX"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Departman (Select) */}
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departman *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Departman seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept.value} value={dept.value}>
                                {dept.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* ─── Talep Detayları ──────────────────── */}
              <div>
                <h3 className="mb-3 text-sm font-medium">Talep Detayları</h3>
                <div className="space-y-4">
                  {/* Öncelik (Radio Group) */}
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Öncelik *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-4"
                          >
                            <FormItem className="flex items-center gap-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="low" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Düşük
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center gap-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="medium" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Orta
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center gap-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="high" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Yüksek
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Açıklama (Textarea) */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Açıklama</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Talebinizi detaylı açıklayın..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Ne kadar detay verirseniz o kadar hızlı çözüm üretilir.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Memnuniyet (Slider) */}
                  <FormField
                    control={form.control}
                    name="satisfaction"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Memnuniyet Puanı</FormLabel>
                          <span className="text-sm font-medium">
                            {field.value}/10
                          </span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={([val]) => field.onChange(val)}
                          />
                        </FormControl>
                        <FormDescription>
                          Genel memnuniyet puanınızı seçin (0=çok kötü, 10=mükemmel)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* ─── Tercihler ────────────────────────── */}
              <div>
                <h3 className="mb-3 text-sm font-medium">Tercihler</h3>
                <div className="space-y-4">
                  {/* Bildirimler (Switch) */}
                  <FormField
                    control={form.control}
                    name="notifications"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Email Bildirimleri
                          </FormLabel>
                          <FormDescription>
                            Talep durumu değiştiğinde email al
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Koşullar (Checkbox) */}
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex items-start gap-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Kullanım koşullarını kabul ediyorum *
                          </FormLabel>
                          <FormDescription>
                            Verileriniz güvenli şekilde saklanır ve sadece talep
                            takibi için kullanılır.
                          </FormDescription>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* ─── Butonlar ─────────────────────────── */}
              <div className="flex gap-3">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Gönderiliyor..." : "Gönder"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Temizle
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
