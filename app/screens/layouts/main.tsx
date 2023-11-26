import { Footer } from "@/screens/components/footer";
import { Header } from "@/screens/components/header";
import { Outlet } from "@remix-run/react";

import { Container } from "@/screens/components/container";
import { Menu } from "@/screens/components/menu";
import { RightContainer } from "@/screens/components/right-container";

import { useEffect } from "react";

function useBodyScrollLock() {
  useEffect(() => {
    const body = document.body;

    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = "";
    };
  }, []);
}

export function MainLayout() {
  useBodyScrollLock();

  return (
    <Container>
      <Menu />
      <RightContainer>
        <Header />
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </RightContainer>
    </Container>
  );
}
