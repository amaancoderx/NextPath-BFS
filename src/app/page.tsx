import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/sidebar/sidebar-main"
import { Header } from "./components/header/header-main"
import { Main } from "./components/workarea/main"
import { cookies } from "next/headers"

export default async function Home() {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <Main />
      </SidebarInset>
    </SidebarProvider>
  )
}
