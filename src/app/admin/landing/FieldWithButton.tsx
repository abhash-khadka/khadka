import TranslateButton from "@/components/TranslateButton";

export default function FieldWithButton({ label, name, value, onChange, onTranslate, sourceLang, targetLang, textarea = false }: { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; onTranslate: (text: string) => void; sourceLang: string; targetLang: string; textarea?: boolean; }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <label className="block text-xs font-semibold text-gray-400 tracking-widest uppercase">{label}</label>
        <TranslateButton text={value} sourceLanguage={sourceLang} targetLanguage={targetLang} onTranslated={onTranslate} />
      </div>
      {textarea ? (
        <textarea name={name} value={value} onChange={onChange} rows={3} className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors rounded-sm resize-none" />
      ) : (
        <input type="text" name={name} value={value} onChange={onChange} className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors rounded-sm" />
      )}
    </div>
  )
}

export function SmallFieldWithButton({ label, name, value, onChange, onTranslate, sourceLang, targetLang }: { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onTranslate: (text: string) => void; sourceLang: string; targetLang: string; }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <label className="block text-[10px] font-semibold text-gray-400 tracking-widest uppercase">{label}</label>
        <TranslateButton text={value} sourceLanguage={sourceLang} targetLanguage={targetLang} onTranslated={onTranslate} />
      </div>
      <input type="text" name={name} value={value} onChange={onChange} className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2 text-xs focus:outline-none focus:border-[#c9a84c] transition-colors rounded-sm" />
    </div>
  )
}
