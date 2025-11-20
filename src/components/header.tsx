"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BrainCircuit, LogOut, User as UserIcon, Menu } from "lucide-react";

export function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`;
    }
    return name.substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-backgrond/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container relative flex h-14 items-center justify-center">
        {/* Logo - left on desktop, centered on mobile */}
        <div className="flex items-center w-full justify-center md:justify-start md:w-auto md:absolute md:left-0 md:top-0 md:h-full">
          <Link href="/" className="flex items-center space-x-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">Study Ai</span>
          </Link>
        </div>
        {/* Desktop Nav - centered */}
        {/* <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/learning">Cheatsheets</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/quiz">Quiz</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/test">Mock Tests</Link>
          </Button>
        </div> */}
        {/* Mobile Hamburger - left on mobile */}
        <div className="flex md:hidden items-center absolute left-0 top-0 h-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/learning">Cheatsheets</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/quiz">Quiz</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/test">Mock Tests</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* User menu - absolutely positioned right */}
        <div className="absolute right-0 top-0 h-full flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.photoURL || undefined}
                      alt={user.displayName || "User"}
                    />
                    <AvatarFallback>
                      {getInitials(user.displayName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-white"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.displayName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="space-x-2">
              <Button asChild className="sm:hidden">
                <Link href="/login">Sign In</Link>
              </Button>

              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href="/login">Sign In</Link>
              </Button>

              <Button asChild className="hidden sm:inline-flex">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
