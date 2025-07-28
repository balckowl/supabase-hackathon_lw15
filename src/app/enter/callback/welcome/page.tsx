import { GridPattern } from "@/components/magicui/grid-pattern";
import StudioNameForm from "@/components/welcome/StudioNameForm";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex items-center mx-auto h-screen max-w-[500px]">
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
      <div className="flex-1 relative">
        <Image src="/pen.png" width={30} height={20} alt="" className="absolute bottom-[-100px] left-[-80px] -rotate-35" />
        <Image src="/clip.png" width={100} height={20} alt="" className="absolute top-[-100px] right-[-100px] rotate-25" />
        <StudioNameForm />
      </div>
    </div>
  );
}
