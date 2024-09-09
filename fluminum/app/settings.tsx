import { View } from "react-native";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Text } from "~/components/ui/text";

function Settings() {
  return (
    <View className="flex-1 items-center gap-5 p-6 bg-secondary/30">
      <Accordion
        type="multiple"
        collapsible
        defaultValue={["item-1"]}
        className="w-full max-w-sm native:max-w-md"
      >
        <AccordionItem value="angle-unit">
          <AccordionTrigger>
            <Text>Angle Unit</Text>
          </AccordionTrigger>
          <AccordionContent>
            <Text>Lorem Ipsum</Text>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="feedbacks">
          <AccordionTrigger>
            <Text>Feedback Kinds</Text>
          </AccordionTrigger>
          <AccordionContent>
            <Text>Sit Amet</Text>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </View>
  );
}

export default Settings;
