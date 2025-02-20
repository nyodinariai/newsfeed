'use client'

import { NavigationMenu as ShadcnNavigationMenu, NavigationMenuList } from "@/ui/shadcn/components/ui/navigation-menu"
import { NavigationMenuItem, NavigationMenuItemProps } from "@/ui/components/header/NavigationMenuItem"

interface NavigationMenuProps {
  items: NavigationMenuItemProps[]
}

export function NavigationMenu({ items }: NavigationMenuProps) {
  return (
    <ShadcnNavigationMenu>
      <NavigationMenuList>
        {items.map((item, index) => (
          <NavigationMenuItem key={index} title={item.title} action={item.action} />
        ))}
      </NavigationMenuList>
    </ShadcnNavigationMenu>
  )
}
