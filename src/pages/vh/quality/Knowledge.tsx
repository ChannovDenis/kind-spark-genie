import { useState, useMemo } from 'react';
import { Plus, Upload } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { CategoryTree } from '@/components/quality/CategoryTree';
import { KnowledgeSearch } from '@/components/quality/KnowledgeSearch';
import { DocumentViewer } from '@/components/quality/DocumentViewer';
import { DocumentProperties } from '@/components/quality/DocumentProperties';
import { DocumentEditor } from '@/components/quality/DocumentEditor';
import { 
  knowledgeCategories, 
  knowledgeDocuments, 
  KnowledgeCategory, 
  KnowledgeDocument,
  getDocumentsByCategory,
  searchDocuments
} from '@/data/knowledgeData';
import { toast } from 'sonner';

export default function Knowledge() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ types: [] as string[], services: [] as string[], status: [] as string[] });
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<KnowledgeDocument | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<KnowledgeDocument | null>(null);

  // Get documents based on search or selected category
  const displayedDocuments = useMemo(() => {
    let docs = searchQuery 
      ? searchDocuments(searchQuery)
      : selectedCategory 
        ? getDocumentsByCategory(selectedCategory.id)
        : knowledgeDocuments;

    // Apply filters
    if (filters.types.length > 0) {
      docs = docs.filter(d => filters.types.includes(d.type));
    }
    if (filters.services.length > 0) {
      docs = docs.filter(d => d.services.some(s => filters.services.includes(s)));
    }
    if (filters.status.length > 0) {
      docs = docs.filter(d => filters.status.includes(d.status));
    }

    return docs;
  }, [searchQuery, selectedCategory, filters]);

  // Auto-select first document when category changes
  const handleCategorySelect = (category: KnowledgeCategory) => {
    setSelectedCategory(category);
    const docs = getDocumentsByCategory(category.id);
    if (docs.length > 0) {
      setSelectedDocument(docs[0]);
    } else {
      setSelectedDocument(null);
    }
  };

  const handleEdit = (document: KnowledgeDocument) => {
    setEditingDocument(document);
    setIsEditorOpen(true);
  };

  const handleDelete = (document: KnowledgeDocument) => {
    toast.success(`Документ "${document.title}" удалён`);
    if (selectedDocument?.id === document.id) {
      setSelectedDocument(null);
    }
  };

  const handleArchive = (document: KnowledgeDocument) => {
    const action = document.status === 'archived' ? 'восстановлен' : 'архивирован';
    toast.success(`Документ "${document.title}" ${action}`);
  };

  const handleDuplicate = (document: KnowledgeDocument) => {
    toast.success(`Создана копия документа "${document.title}"`);
  };

  const handleSave = (data: Partial<KnowledgeDocument>) => {
    if (data.id) {
      toast.success('Документ обновлён');
    } else {
      toast.success('Документ создан');
    }
    setEditingDocument(null);
  };

  const handleNewDocument = () => {
    setEditingDocument(null);
    setIsEditorOpen(true);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="p-6 pb-4">
        <PageHeader
          title="База знаний"
          description="Документы, FAQ и протоколы для AI"
          actions={
            <>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Импорт
              </Button>
              <Button size="sm" onClick={handleNewDocument}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить документ
              </Button>
            </>
          }
        />

        {/* Search */}
        <div className="mt-4">
          <KnowledgeSearch
            value={searchQuery}
            onChange={setSearchQuery}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
      </div>

      {/* Three-column layout */}
      <div className="flex-1 grid grid-cols-[280px_1fr_300px] min-h-0 border-t">
        {/* Left: Category Tree */}
        <div className="border-r bg-sidebar">
          <CategoryTree
            categories={knowledgeCategories}
            selectedCategoryId={selectedCategory?.id || null}
            onSelectCategory={handleCategorySelect}
          />
        </div>

        {/* Center: Document Viewer */}
        <div className="min-h-0 overflow-hidden">
          <DocumentViewer
            document={selectedDocument}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onArchive={handleArchive}
          />
        </div>

        {/* Right: Document Properties */}
        <div className="border-l bg-muted/30">
          <DocumentProperties
            document={selectedDocument}
            onDuplicate={handleDuplicate}
            onArchive={handleArchive}
          />
        </div>
      </div>

      {/* Editor Dialog */}
      <DocumentEditor
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        document={editingDocument}
        onSave={handleSave}
      />
    </div>
  );
}
