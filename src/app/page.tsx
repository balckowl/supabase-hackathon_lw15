import { signInWithGoogle } from "@/actions/auth";
import { AuroraText } from "@/components/magicui/aurora-text";
import { GridPattern } from "@/components/magicui/grid-pattern";
import LoginButton from "@/components/top/LoginButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen">
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
      <div className="pb-[200px]">
        <Image src="/camera.png" width={150} height={200} alt="camera" className="mx-auto mb-10" />
        <h1 className="text-3xl font-bold mb-5">Create your own <br />
          <AuroraText>beautiful</AuroraText> photo gallery on the web.</h1>
        {/* <form onSubmit={signInWithGoogle}> 
          <Button
            type="submit"
            className="flex items-center gap-2 relative cursor-pointer">
            <Image src="/google.svg" width={16} height={16} alt="google logo" />
            Sign in with Google
          </Button>
        </form> */}
        <LoginButton />
      </div>
    </div>
  );
}
