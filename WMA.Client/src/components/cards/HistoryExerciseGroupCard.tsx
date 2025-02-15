import { ExerciseGroup } from "@/stores/@types/workout.store";
import { View, Text } from "react-native";
import { List } from "react-native-paper";
import Plate from "../dynamic_assets/Plate";
import { BG_COLOUR_SECONDARY_2 } from "@/utils/designStyles";

interface IHistoryExerciseGroupCardProps {
  exerciseGroup: ExerciseGroup;
}

const HistoryExerciseGroupCard = ({
  exerciseGroup,
}: IHistoryExerciseGroupCardProps) => {
  const renderAccordionContent = () => {
    return exerciseGroup.exerciseSets.map((exerciseSet, index) => {
      return (
        <List.Item
          key={index}
          style={{
            backgroundColor: "none",
            padding: 0,
            margin: 0,
          }}
          title={`${exerciseSet.weightKG} kg x ${exerciseSet.reps} reps`}
        />
      );
    });
  };

  return (
    <View>
      <List.Accordion
        title={exerciseGroup.exercise.name}
        left={(props) => <Plate radius={30} holeRadius={10} />}
        style={{ width: "100%", backgroundColor: BG_COLOUR_SECONDARY_2 }}
      >
        {renderAccordionContent()}
      </List.Accordion>
    </View>
  );
};
export default HistoryExerciseGroupCard;
