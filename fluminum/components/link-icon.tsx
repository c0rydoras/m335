import { Href, Link } from "expo-router";
import { View } from "react-native";
import { cn } from "~/lib/utils";
import Icon from "~/components/icon";
import type { LucideIcon } from "lucide-react-native";

function LinkIcon(props: { Icon: LucideIcon; href: Href }) {
  return (
    <Link href={props.href} className="p-2">
      <View
        className={cn(
          "flex-1 aspect-square pt-0.5 justify-center items-start web:px-5 hover:opacity-70",
        )}
      >
        <Icon
          icon={props.Icon}
          className="text-foreground"
          size={23}
          strokeWidth={1.25}
        />
      </View>
    </Link>
  );
}

export default LinkIcon;
