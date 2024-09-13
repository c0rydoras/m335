import { Href, Link } from "expo-router";
import Icon from "~/components/icon";
import type { LucideIcon } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

function LinkIcon(props: { Icon: LucideIcon; href: Href }) {
  return (
    <Link href={props.href} asChild>
      <TouchableOpacity>
        <Icon
          icon={props.Icon}
          className="text-foreground"
          size={27}
          strokeWidth={1.25}
        />
      </TouchableOpacity>
    </Link>
  );
}

export default LinkIcon;
