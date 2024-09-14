import { SelectGroup } from "~/components/ui/select";
import { SelectContent } from "~/components/ui/select";
import { SelectLabel } from "~/components/ui/select";
import { SelectItem } from "~/components/ui/select";
import { render } from "@testing-library/react-native";
import { Select } from "~/components/ui/select";

test("<Settings />", () => {
    const tree = render(
        <Select>
            <SelectContent className='w-[250px]'>
                <SelectGroup>
                    <SelectLabel>Angle units</SelectLabel>
                    <SelectItem label='Deg' value='deg'>
                        Deg
                    </SelectItem>
                    <SelectItem label='Rad' value='rad'>
                        Rad
                    </SelectItem>
                    <SelectItem label='Percent' value='percent'>
                        Percent
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>

    );
    expect(tree).toMatchSnapshot();
  });