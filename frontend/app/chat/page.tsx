export default function ChatEmpty() {
  return (
    <div
      className="
      flex flex-1
      items-center
      justify-center
      text-center
      text-muted-foreground
    "
    >
      <div className="space-y-3">
        <div
          className="
          w-14 h-14
          rounded-full
          border border-dashed
          flex items-center justify-center
          mx-auto
        "
        >
          💬
        </div>

        <p className="text-sm">Выберите чат или создайте новый</p>
      </div>
    </div>
  );
}
