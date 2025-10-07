# 🔄 Migration Guide: alert() → Toast Notifications

Bu rehber, eski `alert()` kullanımlarını modern toast notification sistemine nasıl dönüştüreceğinizi gösterir.

---

## 📦 Hazırlık

### Import Edin

```typescript
import { notifySuccess, notifyError, notifyWarning } from '@/lib/toast-helpers'
// veya
import { showSuccess, showError, showWarning } from '@/lib/toast'
```

---

## 🔄 Dönüşüm Örnekleri

### ✅ Basit Alert Dönüşümü

```typescript
// ❌ ESKİ
if (success) {
  alert("İşlem başarılı!")
}

// ✅ YENİ
if (success) {
  notifySuccess("İşlem başarılı!")
}
```

---

### ✅ Hata Mesajları

```typescript
// ❌ ESKİ
catch (error) {
  alert("Hata oluştu!")
}

// ✅ YENİ
catch (error) {
  notifyError("Hata oluştu!")
}
```

---

### ✅ API İşlemleri

```typescript
// ❌ ESKİ
const res = await fetch('/api/customers', { method: 'POST', body: JSON.stringify(data) })
if (res.ok) {
  alert("Müşteri oluşturuldu!")
} else {
  alert("Hata oluştu!")
}

// ✅ YENİ - Basit
const res = await fetch('/api/customers', { method: 'POST', body: JSON.stringify(data) })
if (res.ok) {
  notifySuccess("Müşteri başarıyla oluşturuldu!")
} else {
  notifyError("Müşteri oluşturulamadı!")
}

// ✅✅ YENİ - En İyi (Otomatik loading state)
import { handleSave } from '@/lib/toast-helpers'

await handleSave(
  fetch('/api/customers', { method: 'POST', body: JSON.stringify(data) }),
  'Müşteri'
)
// Otomatik olarak: "Müşteri kaydediliyor...", "Müşteri başarıyla kaydedildi!", veya hata mesajı
```

---

### ✅ Silme İşlemleri

```typescript
// ❌ ESKİ
const handleDelete = async (id: string) => {
  if (confirm("Silmek istediğinize emin misiniz?")) {
    const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' })
    if (res.ok) {
      alert("Silindi!")
    } else {
      alert("Silinemedi!")
    }
  }
}

// ✅ YENİ
import { handleDelete, confirmAction } from '@/lib/toast-helpers'

const handleDelete = async (id: string) => {
  if (confirmAction("Bu müşteriyi silmek istediğinize emin misiniz?")) {
    await handleDelete(
      fetch(`/api/customers/${id}`, { method: 'DELETE' }),
      'Müşteri'
    )
  }
}
```

---

### ✅ Form Submission

```typescript
// ❌ ESKİ
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  
  try {
    const res = await fetch('/api/categories', { 
      method: 'POST',
      body: JSON.stringify(formData) 
    })
    
    if (res.ok) {
      alert("Kategori oluşturuldu!")
      await fetchCategories()
    } else {
      alert("Hata oluştu!")
    }
  } catch (error) {
    alert("Hata oluştu!")
  } finally {
    setLoading(false)
  }
}

// ✅ YENİ
import { toastPromise } from '@/lib/toast'

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  await toastPromise(
    fetch('/api/categories', { 
      method: 'POST',
      body: JSON.stringify(formData) 
    }).then(async (res) => {
      if (!res.ok) throw new Error('İşlem başarısız')
      await fetchCategories()
      return res.json()
    }),
    {
      loading: 'Kaydediliyor...',
      success: 'Kategori başarıyla oluşturuldu!',
      error: 'Hata oluştu!'
    }
  )
}
```

---

## 🎨 Toast Tipleri

### Success (Başarılı İşlem)
```typescript
notifySuccess("İşlem başarılı!")
// Yeşil renk, check icon
```

### Error (Hata)
```typescript
notifyError("Bir hata oluştu!")
// Kırmızı renk, X icon
```

### Warning (Uyarı)
```typescript
notifyWarning("Dikkat! Stok azalıyor")
// Turuncu renk, warning icon
```

---

## 🚀 Advanced Kullanım

### Promise Based (Otomatik Loading)

```typescript
import { toastPromise } from '@/lib/toast'

const result = await toastPromise(
  apiCall(),
  {
    loading: 'İşlem yapılıyor...',
    success: (data) => `${data.name} başarıyla eklendi!`,
    error: (err) => `Hata: ${err.message}`
  }
)
```

### Custom Duration

```typescript
import toast from 'react-hot-toast'

toast.success('Bu mesaj 5 saniye kalacak', {
  duration: 5000
})
```

### Custom Styling

```typescript
import toast from 'react-hot-toast'

toast.success('Özel stil!', {
  style: {
    border: '1px solid #713200',
    padding: '16px',
    color: '#713200',
  },
  iconTheme: {
    primary: '#713200',
    secondary: '#FFFAEE',
  },
})
```

---

## 📝 Checklist: Hangi Dosyalar Değiştirilmeli?

Aşağıdaki dosyalarda `alert()` kullanımı tespit edildi:

### Yüksek Öncelik (Form İşlemleri)
- [x] `app/(dashboard)/dashboard/categories/page.tsx` ✅ YAPILDI
- [x] `app/(dashboard)/dashboard/services/new/page.tsx` ✅ YAPILDI
- [x] `app/(dashboard)/dashboard/customers/new/page.tsx` ✅ YAPILDI
- [ ] `app/(dashboard)/dashboard/cash/new/page.tsx`
- [ ] `app/(dashboard)/dashboard/stock/new/page.tsx`
- [ ] `app/(dashboard)/dashboard/staff/new/page.tsx`

### Orta Öncelik (Edit Sayfaları)
- [ ] `app/(dashboard)/dashboard/customers/[id]/edit/page.tsx`
- [ ] `app/(dashboard)/dashboard/services/[id]/edit/page.tsx`
- [ ] `app/(dashboard)/dashboard/kasa/entry/[id]/edit/page.tsx`

### Düşük Öncelik (Diğer)
- [ ] Diğer tüm sayfalarda search (15+ dosya)

---

## 🔍 Alert Kullanımlarını Bulma

```bash
# Tüm alert() kullanımlarını bul
grep -rn "alert(" app/ --include="*.tsx" --include="*.ts"

# Tüm console.error kullanımlarını bul
grep -rn "console.error" app/ --include="*.tsx" --include="*.ts"

# Tüm console.log kullanımlarını bul
grep -rn "console.log" app/ --include="*.tsx" --include="*.ts"
```

---

## ✅ Test Etme

Migration sonrası test:

1. **Form submission:** Yeni kayıt oluştur
2. **Edit:** Var olan kaydı düzenle
3. **Delete:** Kayıt sil
4. **Error:** Hatalı veri gönder
5. **Loading:** Yavaş network ile test et

---

## 💡 Best Practices

### ✅ DO (Yapın)
- Toast kullan
- Anlamlı mesajlar yaz
- Loading states göster
- Error details ekle

### ❌ DON'T (Yapmayın)
- alert() kullanma
- Generic "Hata oluştu" yazma
- console.error() ile kullanıcıya hata gösterme
- Çok uzun mesajlar yazma

---

## 🎓 Örnekler

### Gerçek Dünya Örnekleri

```typescript
// ✅ Müşteri oluşturma
await handleSave(
  fetch('/api/customers', { method: 'POST', body: JSON.stringify(customer) }),
  'Müşteri'
)

// ✅ Servis güncelleme
await handleUpdate(
  fetch(`/api/services/${id}`, { method: 'PUT', body: JSON.stringify(service) }),
  'Servis'
)

// ✅ Kategori silme
if (confirmAction("Bu kategoriyi silmek istediğinize emin misiniz?")) {
  await handleDelete(
    fetch(`/api/categories/${id}`, { method: 'DELETE' }),
    'Kategori'
  )
}

// ✅ Stok uyarısı
if (stock.quantity < stock.minQuantity) {
  notifyWarning(`${stock.name} stoku azalıyor! (${stock.quantity} adet kaldı)`)
}
```

---

**Yardıma ihtiyacın olursa, örnekleri incele veya sor!** 🚀

