import ServiceProviderUser from "@/components/ServiceProviderUser/ServiceProviderUser";
import { getServiceProfileById } from "@/services/profileService";
import { Metadata } from "next";

interface PageProps {
  params: Promise<ProductParams>
}

interface ProductParams {
  id: string;
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const user = await getServiceProfileById((await params).id);

  if (!user) {
    return {
      title: "Proveedor no encontrado | TecniClick",
    };
  }

  return {
    title: `${user.userName} | TecniClick`,
  };
}


export default async function SlugProduct ({ params }: { params: Promise<ProductParams> }) {

  const { id } = await params;


  const user = await getServiceProfileById(id)

  return (
    <div className="mx-[4%] xl:mt-[5vh] 2xl:mt-[10vh]">
      {user ? (
        <div className="flex justify-center items-center">
          <ServiceProviderUser {...user}
          />

        </div>
      ) : (
        <h2 className="w-full pt-[20vh] text-center">Usuario no encontrado</h2>
      )}
    </div>
  );
};