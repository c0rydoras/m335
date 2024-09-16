import { render } from "@testing-library/react-native";
import { ToggleGroup } from "~/components/ui/toggle-group";
import { ToggleGroupItem } from "~/components/ui/toggle-group";
import { Text } from "~/components/ui/text";

test("Toggle group", () => {
    const tree = render(
        <ToggleGroup onValueChange={() => {}} value='deg' type="single">
            <ToggleGroupItem value="deg">
                <Text>
                    Deg
                </Text>
            </ToggleGroupItem>
            <ToggleGroupItem value="rad">
                <Text>
                    Rad
                </Text>
            </ToggleGroupItem>
            <ToggleGroupItem value="percent">
                <Text>
                    Percent
                </Text>
            </ToggleGroupItem>
        </ToggleGroup>
    );
    expect(tree).toMatchSnapshot();
  });