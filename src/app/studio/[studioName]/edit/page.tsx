import EditForm from "@/components/studio/EditForm";
import { hono } from "@/lib/hono";

type Props = {
  params: Promise<{ studioName: string }>
}

export default async function Page({ params }: Props) {

  const { studioName } = await params

   const res = await hono.api.studios[":studioName"].$get({
      param: {
        studioName
      }
    })
  
    if (res.status === 404) {
      return <div>スタジオはありません。</div>
    }
  
    const studio = await res.json()

  return (
    <>
      <EditForm studioName={studioName} studio={studio}/>
    </>
  );
}
