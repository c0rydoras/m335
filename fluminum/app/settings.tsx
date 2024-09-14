import {View} from "react-native";
import {Text} from "~/components/ui/text";
import {ToggleGroup, ToggleGroupItem} from "~/components/ui/toggle-group";
import {useEffect, useMemo, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

function Settings() {
    const [feedbackValue, setFeedbackValue] = useState<string[]>([]);
    const [angleUnit, setAngleUnit] = useState<string>("rad");
    const [isLoading, setIsLoading] = useState(true);

    useMemo(async () => {
        if(!isLoading){
            await AsyncStorage.setItem("feedbackValue", JSON.stringify(feedbackValue));
        }
    }, [feedbackValue,isLoading]);

    useMemo(async () => {
        if(!isLoading){
            await AsyncStorage.setItem("angleUnit", angleUnit);
        }
    }, [angleUnit,isLoading]);

    useEffect(() => {
        AsyncStorage.getItem("feedbackValue").then((storedFeedbackValue) => {
            AsyncStorage.getItem("angleUnit").then((storedAngleUnit) => {
                storedFeedbackValue && setFeedbackValue(JSON.parse(storedFeedbackValue));
                storedAngleUnit && setAngleUnit(storedAngleUnit);
                setIsLoading(false);
            })
        })
    }, [])

    const insets = useSafeAreaInsets();
    const contentInsets = {
      top: insets.top,
      bottom: insets.bottom,
      left: 12,
      right: 12,
    };

    const angleUnits: { [key:string]: string;} = {
        "rad": "Rad",
        "deg": "Deg",
        "percent": "Percent"
    }

    return (
      <View className="flex-1 items-center gap-5 p-6 bg-secondary/30">
        <Text>Angle measurement unit</Text>
        <Select onValueChange={(option) => setAngleUnit(option?.value || 'deg')} value={{'label': angleUnits[angleUnit], value: angleUnit}}>
            <SelectTrigger className='w-[250px]'>
                <SelectValue
                    className='text-foreground text-sm native:text-lg'
                    placeholder='Select an angle unit'
                />
            </SelectTrigger>
            <SelectContent insets={contentInsets} className='w-[250px]'>
                <SelectGroup>
                    <SelectLabel>Angle units</SelectLabel>
                    <SelectItem label='Rad' value='rad'>
                        Rad
                    </SelectItem>
                    <SelectItem label='Deg' value='deg'>
                        Deg
                    </SelectItem>
                    <SelectItem label='Percent' value='percent'>
                        Percent
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>


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
