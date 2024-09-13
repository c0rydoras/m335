import { Href, Link } from "expo-router";
import Icon from "~/components/icon";
import type { LucideIcon } from "lucide-react-native";

function LinkIcon(props: { Icon: LucideIcon; href: Href }) {
  return (
    <Link href={props.href} asChild>
      <Icon
        icon={props.Icon}
        className="text-foreground"
        size={27}
        strokeWidth={1.25}
      />
    </Link>
  );
}

export default LinkIcon;
