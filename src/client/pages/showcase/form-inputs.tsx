// Showcase: Form & Giriş Bileşenleri
// Button, Input, Textarea, Select, Checkbox, Radio, Switch, Slider, Toggle,
// Calendar, OTP, FileUpload, TagsInput, Combobox, TimePicker, Label+Form

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { ShowcaseCard } from "@/components/shared/showcase-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar } from "@/components/ui/calendar";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemDelete,
} from "@/components/ui/file-upload";
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputList,
  TagsInputLabel,
} from "@/components/ui/tags-input";
import {
  Combobox,
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import {
  TimePicker,
  TimePickerContent,
  TimePickerHour,
  TimePickerInputGroup,
  TimePickerInput,
  TimePickerMinute,
  TimePickerSeparator,
  TimePickerTrigger,
} from "@/components/ui/time-picker";
import { Bold, Italic, Underline, Loader2, Mail, Plus } from "lucide-react";

const comboboxItems = [
  { value: "istanbul", label: "İstanbul" },
  { value: "ankara", label: "Ankara" },
  { value: "izmir", label: "İzmir" },
  { value: "bursa", label: "Bursa" },
  { value: "antalya", label: "Antalya" },
];

export function ShowcaseFormInputs() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [tags, setTags] = useState(["React", "TypeScript"]);
  const [comboValue, setComboValue] = useState("");
  const [comboOpen, setComboOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Button */}
      <ShowcaseCard title="Button" description="6 varyant: default, secondary, destructive, outline, ghost, link">
        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="icon"><Plus className="h-4 w-4" /></Button>
          <Button disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" />Yükleniyor</Button>
        </div>
      </ShowcaseCard>

      {/* Input */}
      <ShowcaseCard title="Input" description="Text, email, password, disabled">
        <div className="space-y-2">
          <Input placeholder="Metin giriniz..." />
          <Input type="email" placeholder="email@oplog.com" />
          <Input type="password" placeholder="Şifre" />
          <Input disabled placeholder="Disabled" />
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="İkonlu input" />
          </div>
        </div>
      </ShowcaseCard>

      {/* Textarea */}
      <ShowcaseCard title="Textarea" description="Çok satırlı metin alanı">
        <Textarea placeholder="Açıklama yazınız..." rows={3} />
      </ShowcaseCard>

      {/* Select */}
      <ShowcaseCard title="Select" description="Dropdown seçim">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Şehir seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="istanbul">İstanbul</SelectItem>
            <SelectItem value="ankara">Ankara</SelectItem>
            <SelectItem value="izmir">İzmir</SelectItem>
          </SelectContent>
        </Select>
      </ShowcaseCard>

      {/* Checkbox */}
      <ShowcaseCard title="Checkbox" description="Onay kutuları">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="c1" defaultChecked />
            <Label htmlFor="c1">Kullanım koşullarını kabul ediyorum</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="c2" />
            <Label htmlFor="c2">Bülten almak istiyorum</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="c3" disabled />
            <Label htmlFor="c3" className="text-muted-foreground">Disabled</Label>
          </div>
        </div>
      </ShowcaseCard>

      {/* Radio Group */}
      <ShowcaseCard title="Radio Group" description="Tekli seçim">
        <RadioGroup defaultValue="option-1">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-1" id="r1" />
            <Label htmlFor="r1">Standart Kargo</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-2" id="r2" />
            <Label htmlFor="r2">Hızlı Kargo</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-3" id="r3" />
            <Label htmlFor="r3">Aynı Gün Teslimat</Label>
          </div>
        </RadioGroup>
      </ShowcaseCard>

      {/* Switch */}
      <ShowcaseCard title="Switch" description="Açma/kapama toggle">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Bildirimler</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label>Karanlık Mod</Label>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-muted-foreground">Disabled</Label>
            <Switch disabled />
          </div>
        </div>
      </ShowcaseCard>

      {/* Slider */}
      <ShowcaseCard title="Slider" description="Değer kaydırıcı">
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Ses Seviyesi</Label>
            <Slider defaultValue={[50]} max={100} step={1} className="mt-2" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Fiyat Aralığı</Label>
            <Slider defaultValue={[25, 75]} max={100} step={5} className="mt-2" />
          </div>
        </div>
      </ShowcaseCard>

      {/* Toggle & Toggle Group */}
      <ShowcaseCard title="Toggle / Toggle Group" description="Tekli ve grup toggle">
        <div className="space-y-3">
          <div className="flex gap-1">
            <Toggle aria-label="Bold"><Bold className="h-4 w-4" /></Toggle>
            <Toggle aria-label="Italic"><Italic className="h-4 w-4" /></Toggle>
            <Toggle aria-label="Underline"><Underline className="h-4 w-4" /></Toggle>
          </div>
          <ToggleGroup type="single" defaultValue="left">
            <ToggleGroupItem value="left">Sol</ToggleGroupItem>
            <ToggleGroupItem value="center">Orta</ToggleGroupItem>
            <ToggleGroupItem value="right">Sağ</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </ShowcaseCard>

      {/* Calendar */}
      <ShowcaseCard title="Calendar" description="Tarih seçici">
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
      </ShowcaseCard>

      {/* Input OTP */}
      <ShowcaseCard title="Input OTP" description="Tek kullanımlık şifre girişi">
        <div className="flex justify-center">
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </ShowcaseCard>

      {/* File Upload (DiceUI) */}
      <ShowcaseCard title="File Upload" description="Sürükle-bırak dosya yükleme (DiceUI)">
        <FileUpload value={files} onValueChange={setFiles} maxFiles={3}>
          <FileUploadDropzone />
          <FileUploadList>
            {files.map((file, i) => (
              <FileUploadItem key={i} value={file}>
                <FileUploadItemPreview />
                <FileUploadItemMetadata />
                <FileUploadItemDelete />
              </FileUploadItem>
            ))}
          </FileUploadList>
        </FileUpload>
      </ShowcaseCard>

      {/* Tags Input (DiceUI) */}
      <ShowcaseCard title="Tags Input" description="Etiket/tag girişi (DiceUI)">
        <TagsInput value={tags} onValueChange={setTags}>
          <TagsInputLabel>Etiketler</TagsInputLabel>
          <TagsInputList>
            {tags.map((tag) => (
              <TagsInputItem key={tag} value={tag}>
                {tag}
              </TagsInputItem>
            ))}
            <TagsInputInput placeholder="Etiket ekle..." />
          </TagsInputList>
        </TagsInput>
      </ShowcaseCard>

      {/* Combobox (DiceUI) */}
      <ShowcaseCard title="Combobox" description="Aranabilir dropdown (DiceUI)">
        <Combobox
          value={comboValue}
          onValueChange={setComboValue}
          open={comboOpen}
          onOpenChange={setComboOpen}
        >
          <ComboboxAnchor>
            <ComboboxInput placeholder="Şehir ara..." />
            <ComboboxTrigger />
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxEmpty>Sonuç yok</ComboboxEmpty>
            {comboboxItems.map((item) => (
              <ComboboxItem key={item.value} value={item.value}>
                {item.label}
              </ComboboxItem>
            ))}
          </ComboboxContent>
        </Combobox>
      </ShowcaseCard>

      {/* Time Picker (DiceUI) */}
      <ShowcaseCard title="Time Picker" description="Saat seçici (DiceUI)">
        <TimePicker>
          <TimePickerInputGroup>
            <TimePickerInput />
            <TimePickerTrigger />
          </TimePickerInputGroup>
          <TimePickerContent>
            <TimePickerHour />
            <TimePickerSeparator />
            <TimePickerMinute />
          </TimePickerContent>
        </TimePicker>
      </ShowcaseCard>

      {/* TanStack Form Mini Demo */}
      <ShowcaseCard title="TanStack Form" description="@tanstack/react-form + Field bileseni">
        <TanStackFormDemo />
      </ShowcaseCard>
    </div>
  );
}

function TanStackFormDemo() {
  const form = useForm({
    defaultValues: { name: "", email: "" },
    onSubmit: ({ value }) => {
      alert(`Isim: ${value.name}, Email: ${value.email}`);
    },
  });

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
      className="space-y-3"
    >
      <form.Field name="name">
        {(field) => (
          <div className="space-y-1">
            <Label htmlFor={field.name}>Isim *</Label>
            <Input
              id={field.name}
              placeholder="Adiniz"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      </form.Field>
      <form.Field name="email">
        {(field) => (
          <div className="space-y-1">
            <Label htmlFor={field.name}>Email *</Label>
            <Input
              id={field.name}
              type="email"
              placeholder="mail@oplog.com"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      </form.Field>
      <Button type="submit" size="sm">Gonder</Button>
    </form>
  );
}
