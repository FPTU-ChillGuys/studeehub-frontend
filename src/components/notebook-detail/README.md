# Notebook Detail Components

Thư mục này chứa các components được tách ra từ trang Notebook Detail để code gọn gàng và dễ maintain hơn.

## Cấu trúc Components

### 1. **NotebookHeader.tsx**
- Hiển thị breadcrumb navigation
- Props: `notebookTitle`

### 2. **ChatSection.tsx**
- Component chính cho phần chat với AI
- Bao gồm: header của notebook, danh sách messages, và message input
- Props: `notebook`, `messages`, `inputMessage`, `setInputMessage`, `handleSendMessage`, `selectedDocuments`, `getFileIcon`

### 3. **ChatMessage.tsx**
- Component hiển thị từng message trong chat
- Tự động format message của user vs AI khác nhau
- Hiển thị sources (documents) nếu có
- Props: `message`, `documents`

### 4. **MessageInput.tsx**
- Component input để gửi message
- Hiển thị danh sách documents đang được chọn
- Props: `inputMessage`, `setInputMessage`, `handleSendMessage`, `selectedDocuments`, `documents`, `getFileIcon`

### 5. **DocumentsPanel.tsx**
- Panel quản lý documents (chiếm 30% màn hình)
- Bao gồm: header, search, và danh sách documents
- Props: `documents`, `selectedDocuments`, `onToggleDocument`, `onSelectAll`, `onClearSelection`, `searchTerm`, `setSearchTerm`, `setIsUploadModalOpen`, `getFileIcon`, `completedDocsCount`

### 6. **DocumentCard.tsx**
- Component hiển thị từng document trong danh sách
- Bao gồm: checkbox, file icon, thông tin document, action buttons
- Props: `doc`, `isSelected`, `onToggleSelect`, `getFileIcon`

### 7. **DocumentSearch.tsx**
- Component search bar cho documents
- Props: `searchTerm`, `setSearchTerm`

### 8. **utils.tsx**
- Chứa utility functions được dùng chung
- `getFileIcon(type)`: Trả về icon tương ứng với loại file

## Cách sử dụng

Import các components từ file index:

```tsx
import {
  NotebookHeader,
  ChatSection,
  DocumentsPanel,
  getFileIcon
} from "@/components/notebook-detail";
```

Hoặc import riêng lẻ:

```tsx
import NotebookHeader from "@/components/notebook-detail/NotebookHeader";
import ChatSection from "@/components/notebook-detail/ChatSection";
```

## Lợi ích của việc tách components

1. **Code dễ đọc hơn**: Mỗi component có trách nhiệm rõ ràng
2. **Dễ maintain**: Sửa một phần không ảnh hưởng phần khác
3. **Tái sử dụng**: Có thể dùng lại components ở nơi khác
4. **Dễ test**: Test từng component độc lập
5. **Performance**: Có thể optimize từng component riêng
