import Image from "next/image";
import profile from "../../../public/profile.png";

export default function UserImage({ imgUrl, name }: { imgUrl?: string; name?: string }) {
    const image = imgUrl || profile;

    return (
        <div className="relative h-24 w-24 md:h-32 md:w-32 border-4 border-quaternary dark:border-quinary rounded-full overflow-hidden shadow-md">
            <Image
                src={image}
                alt={name || "perfil"}
                fill
                style={{ objectFit: "cover" }}
            />
        </div>
    );
}
