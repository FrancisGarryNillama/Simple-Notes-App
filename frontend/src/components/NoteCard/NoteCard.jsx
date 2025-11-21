import { EditIcon, TrashIcon } from "../icons";

export default function NoteCard({ note, onEdit, onDelete, onTogglePin }) {
  return (
    <div
      className={`p-4 rounded-xl shadow hover:shadow-lg transition-all ${note.color || "bg-white"}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-xl">{note.title}</h3>
          <p className="text-gray-700 mt-2 whitespace-pre-wrap">{note.description}</p>
        </div>
        <div className="flex space-x-2">
          {onTogglePin && (
            <button onClick={() => onTogglePin(note.id)} className="text-gray-500 hover:text-gray-700">
              📌
            </button>
          )}
          <button onClick={() => onEdit(note)}>
            <EditIcon />
          </button>
          <button onClick={() => onDelete(note.id)}>
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
