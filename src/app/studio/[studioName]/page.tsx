import { GridPattern } from "@/components/magicui/grid-pattern";
import PhotosSwiper from "@/components/studio/PhotosSwiper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { hono } from "@/lib/hono";
import { cn } from "@/lib/utils";
import { Edit, User } from "lucide-react"
import { Walter_Turncoat } from "next/font/google";
import Link from "next/link";

type Props = {
  params: Promise<{ studioName: string }>
}

const walter = Walter_Turncoat({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-walter'
})

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
  console.log(studio.isEditable)

  return (
    <div className="h-screen flex items-center justify-center">
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={"5 3"}
        className={cn(
          "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]",
        )}
      />
      <div className="pb-[150px]">
        <div className="flex justify-between items-center px-5 py-4">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={studio.ownerIconUrl ?? undefined} />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <p className={`text-2xl ${walter.className} font-bold`}>
              {studio.studioName}’s photo gallery
            </p>
          </div>
          <Button
            className={`${walter.className} cursor-pointer`}
          >
            <Link href={`/studio/${studio.studioName}/edit`}
              className="flex items-center gap-2"
            >
              <Edit />Edit
            </Link>
          </Button>
        </div>
        <PhotosSwiper photos={studio.photos} />
      </div>
    </div>
  );
}
