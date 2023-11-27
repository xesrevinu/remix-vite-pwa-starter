import { Footer } from "@/app/components/footer";
import { Header } from "@/app/components/header";
import { Outlet } from "@remix-run/react";

import { Container } from "@/app/components/container";
import { Menu } from "@/app/components/menu";
import { RightContainer } from "@/app/components/right-container";

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
