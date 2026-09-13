import * as React from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Redo2,
  Undo2,
} from 'lucide-react';
import { uploadImage } from '@/Components/admin/upload';
import { useTranslations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/**
 * Rich text editor for article bodies (FR-A4).
 *
 * The toolbar is deliberately limited to what the API's sanitiser keeps
 * (App\Services\HtmlSanitizer): headings, emphasis, lists, quotes, links, and images.
 * Offering a control whose output the server would strip would just look like a
 * bug to the editor.
 */

/** Mirrors config('coecbsa.media.accepted_mime'); see the note in upload.ts. */
const ACCEPTED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

type ToolbarButtonProps = {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
};

function ToolbarButton({ onClick, active, disabled, label, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors duration-fast',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
        'disabled:cursor-not-allowed disabled:opacity-45',
        active
          ? 'bg-primary text-primary-fg'
          : 'text-foreground-muted hover:bg-surface-2 hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const t = useTranslations('admin.richText');
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function promptForLink() {
    const previous = editor.getAttributes('link').href as string | undefined;
    const href = window.prompt(t('linkPrompt'), previous ?? 'https://');

    // Cancelled — leave the selection untouched.
    if (href === null) return;
    if (href.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: href.trim(), target: '_blank', rel: 'noopener noreferrer' })
      .run();
  }

  async function insertImage(file: File) {
    setError(null);
    setUploading(true);
    try {
      const url = await uploadImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('uploadFailed'));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="border-b border-line bg-surface-2 px-2 py-1.5">
      <div className="flex flex-wrap items-center gap-0.5">
        <ToolbarButton
          label={t('heading2')}
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          label={t('heading3')}
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-4 w-4" aria-hidden />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-line" aria-hidden />

        <ToolbarButton
          label={t('bold')}
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          label={t('italic')}
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" aria-hidden />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-line" aria-hidden />

        <ToolbarButton
          label={t('bulletList')}
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          label={t('orderedList')}
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          label={t('quote')}
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" aria-hidden />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-line" aria-hidden />

        <ToolbarButton label={t('link')} active={editor.isActive('link')} onClick={promptForLink}>
          <Link2 className="h-4 w-4" aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          label={t('unlink')}
          disabled={!editor.isActive('link')}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <Link2Off className="h-4 w-4" aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          label={t('image')}
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <ImagePlus className="h-4 w-4" aria-hidden />
          )}
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-line" aria-hidden />

        <ToolbarButton
          label={t('undo')}
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="h-4 w-4" aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          label={t('redo')}
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="h-4 w-4" aria-hidden />
        </ToolbarButton>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPTED_MIME.join(',')}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void insertImage(file);
        }}
      />

      {error && (
        <p className="px-1 pb-1 pt-1.5 text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  ariaLabel,
}: {
  value: string;
  onChange: (html: string) => void;
  /** Defaults to the Indonesian-body placeholder. */
  placeholder?: string;
  ariaLabel: string;
}) {
  const t = useTranslations('admin.richText');
  const editor = useEditor({
    // Tiptap renders on the client only; SSR would mismatch the hydrated DOM.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: false }),
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder: placeholder ?? t('placeholder') }),
    ],
    content: value,
    editorProps: {
      attributes: {
        'aria-label': ariaLabel,
        class: 'prose-article min-h-[16rem] px-4 py-3 focus:outline-none',
      },
    },
    onUpdate: ({ editor: instance }) => {
      // An "empty" document still serialises to <p></p>; report that as empty so
      // required-field validation behaves the way the writer expects.
      onChange(instance.isEmpty ? '' : instance.getHTML());
    },
  });

  // Re-seed when the parent swaps in a different article (create → edit, or a
  // locale tab switch); guard on equality or every keystroke would reset it.
  React.useEffect(() => {
    if (editor && !editor.isDestroyed && value !== (editor.isEmpty ? '' : editor.getHTML())) {
      editor.commands.setContent(value, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="min-h-[19rem] rounded-md border border-line bg-surface" aria-busy>
        <div className="border-b border-line bg-surface-2 px-2 py-1.5">
          <div className="h-9 w-full max-w-xs animate-pulse rounded-md bg-surface" />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-line bg-surface focus-within:border-primary focus-within:ring-2 focus-within:ring-focus">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
