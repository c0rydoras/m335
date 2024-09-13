import {View} from "react-native";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "~/components/ui/accordion";
import {Text} from "~/components/ui/text";
import {ToggleGroup, ToggleGroupItem} from "~/components/ui/toggle-group";
import {useEffect, useMemo, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Settings() {
    const [feedbackValue, setFeedbackValue] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useMemo(async () => {
        if(!isLoading){
            await AsyncStorage.setItem("feedbackValue", JSON.stringify(feedbackValue));
        }
    }, [feedbackValue,isLoading]);

    useEffect(() => {
        AsyncStorage.getItem("feedbackValue").then((value) => {
            if (value) {
                console.log(value)
                setFeedbackValue(JSON.parse(value));
                setIsLoading(false);
            }
        })
    }, [])

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
          </Accordion>
          <Text>Feedback-Arten</Text>
                      <ToggleGroup onValueChange={setFeedbackValue} value={feedbackValue} type="multiple">
                          <ToggleGroupItem className={feedbackValue.includes("vibration")?"bg-[#FFE500]":""} value="vibration">
                              <Text>
                                  Vibration
                              </Text>
                          </ToggleGroupItem>
                          <ToggleGroupItem value="visual">
                              <Text>
                                  Lampe
                              </Text>
                          </ToggleGroupItem>
                          <ToggleGroupItem value="audio">
                              <Text>
                                  Audio
                              </Text>
                          </ToggleGroupItem>
                      </ToggleGroup>

      </View>
    );
}

export default Settings;
