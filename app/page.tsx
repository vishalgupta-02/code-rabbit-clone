import { Button } from "@/components/ui/button";
import Logout from "@/module/auth/components/logout";
import { requireAuth } from "@/module/auth/utils/auth-utils";

export default async function Home() {
  await requireAuth();

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Logout>
        <Button className="cursor-pointer">Hello World</Button>
      </Logout>
    </div>
  );
}
