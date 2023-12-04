import { Menu, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";

type DropDownProps = {
  MenuButtonContent: ReactNode;
  MenuItemsContent: ReactNode;
};

export default function DropDown({
  MenuButtonContent,
  MenuItemsContent,
}: DropDownProps) {
  return (
    <section>
      <Menu as="section" className="relative inline-block text-left">
        <Menu.Button>{MenuButtonContent}</Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={`absolute bottom-[4.5rem] left-0 mt-2 w-56 origin-bottom-left border text-white rounded`}
          >
            {MenuItemsContent}
          </Menu.Items>
        </Transition>
      </Menu>
    </section>
  );
}
