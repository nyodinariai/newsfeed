'use client'

import { Button }  from "@/ui/shadcn/components/ui/button"
import { NavigationMenuLink, NavigationMenuItem as RadixNavigationMenuItem } from "@/ui/shadcn/components/ui/navigation-menu"

export interface NavigationMenuItemProps {
  title: string
  action: () => void
}

export function NavigationMenuItem({ title, action }: NavigationMenuItemProps) {
  return (
    <RadixNavigationMenuItem>
      <NavigationMenuLink asChild>
        <Button onClick={action} variant="ghost">
          {title}
        </Button>
      </NavigationMenuLink>
    </RadixNavigationMenuItem>
  )
}
