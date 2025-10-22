## 🚀 Quick Reference: File Types Configuration

### Thêm file type mới chỉ với 1 file!

**File cần sửa:** `src/config/fileTypes.ts`

```typescript
// Thêm 5 dòng này để support file type mới:

export const SUPPORTED_EXTENSIONS = [
  "pdf", "doc", "docx", "txt", "pptx", "xlsx", "csv",
  "newtype",  // ← 1. Thêm extension
];

export const DOCUMENT_TYPES = [
  "PDF", "DOCX", "TXT", "PPTX", "XLSX", "CSV",
  "NEWTYPE"  // ← 2. Thêm document type
];

export const MIME_TYPES = {
  // ...
  newtype: "application/newtype",  // ← 3. Thêm MIME type
};

export const EXTENSION_TO_TYPE = {
  // ...
  newtype: "NEWTYPE",  // ← 4. Thêm mapping
};

export const FILE_TYPE_LABELS = {
  // ...
  NEWTYPE: "New Type Document",  // ← 5. Thêm label
};
```

**Xong!** Tất cả các file khác tự động cập nhật! ✨

---

### Sử dụng trong code:

```typescript
// Import
import { FILE_INPUT_ACCEPT, DOCUMENT_TYPES, getDocumentType } from "@/config/fileTypes";

// Trong React component
<input type="file" accept={FILE_INPUT_ACCEPT} />
<p>Supported: {DOCUMENT_TYPES.join(", ")}</p>

// Validate file
const docType = getDocumentType(filename);
if (!docType) {
  throw new Error("Invalid file type");
}
```

---

### Lợi ích:

✅ **1 file duy nhất** để quản lý tất cả file types  
✅ **Type-safe** - TypeScript kiểm tra tự động  
✅ **Không bỏ sót** - Không thể quên update UI/API  
✅ **Dễ maintain** - Thêm type mới trong < 1 phút  

---

Xem thêm: [FILE_TYPES_GUIDE_VI.md](./FILE_TYPES_GUIDE_VI.md)
