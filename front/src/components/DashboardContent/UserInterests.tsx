import { CategoryType } from "@/helpers/typeMock";

export default function UserInterests({ interests }: { interests: CategoryType[] }) {
    return (
        <div className="bg-quaternary/30 dark:bg-quinary/40 p-4 rounded-2xl border borders shadow-sm">
            <h2 className="text-lg font-semibold mb-3 border-b pb-1">Intereses</h2>
            <p className="text-sm">{interests.join(", ")}</p>
        </div>
    );
}
