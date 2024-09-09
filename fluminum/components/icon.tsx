import { iconWithClassName } from "~/lib/icons/iconWithClassName";
import type { LucideIcon, LucideProps } from "lucide-react-native";

function Icon({
  icon: Component,
  ...rest
}: LucideProps & { icon: LucideIcon }) {
  iconWithClassName(Component);
  return <Component {...rest} />;
}

export default Icon;
