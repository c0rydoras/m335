import { render } from "@testing-library/react-native";
import { Sun } from "lucide-react-native";

import Icon from "~/components/icon";

describe("<Icon />", () => {
  test("with just icon", () => {
    const tree = render(<Icon icon={Sun} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("with props", () => {
    const tree = render(
      <Icon icon={Sun} className="text-red-500" size={50} />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
