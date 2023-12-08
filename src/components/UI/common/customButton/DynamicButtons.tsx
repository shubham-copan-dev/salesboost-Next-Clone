import { Flex, Button, Text, Box, Image } from "@chakra-ui/react";
import { ArrowUpDownIcon, RepeatIcon, SettingsIcon } from "@chakra-ui/icons"; // Assuming SettingsIcon is from Chakra UI icons
import { ChevronDownIcon, RowIcon } from "@/chakraConfig/icons";

const DynamicButtons = ({ buttonData }: { buttonData: { text: string }[] }) => {
  return (
    <Flex justifyContent="space-between">
      <Flex>
        {buttonData.map((item, index) => (
          <Button
            key={index}
            color="var(--grey-600, #394256)"
            textAlign="center"
            fontFamily="Poppins"
            fontSize="12px"
            fontStyle="normal"
            fontWeight="500"
            lineHeight="120%"
            display="flex"
            padding="5px"
            flexDirection="column"
            alignItems="flex-start"
            gap="10px"
            backgroundColor="bgClr.NeutralColorWhite"
          >
            <Flex alignItems="center" gap="5px">
              <SettingsIcon />
              <Text>{item.text}</Text>
            </Flex>
          </Button>
        ))}
      </Flex>
      <Flex>
        <Button
          color="var(--grey-600, #394256)"
          textAlign="center"
          fontFamily="Poppins"
          fontSize="12px"
          fontStyle="normal"
          fontWeight="500"
          lineHeight="120%"
          display="flex"
          padding="5px"
          flexDirection="column"
          alignItems="flex-start"
          gap="10px"
          backgroundColor="bgClr.NeutralColorWhite"
        >
          <Flex alignItems="center" gap="5px">
            <RowIcon />
          </Flex>
        </Button>
        <Button
          color="var(--grey-600, #394256)"
          textAlign="center"
          fontFamily="Poppins"
          fontSize="12px"
          fontStyle="normal"
          fontWeight="500"
          lineHeight="120%"
          display="flex"
          padding="5px"
          flexDirection="column"
          alignItems="flex-start"
          gap="10px"
          backgroundColor="bgClr.NeutralColorWhite"
        >
          <Flex alignItems="center" gap="5px">
            <Image
              src="/assets/images/download-icon.png"
              alt="download"
            ></Image>
          </Flex>
        </Button>
        <Button
          color="var(--grey-600, #394256)"
          textAlign="center"
          fontFamily="Poppins"
          fontSize="12px"
          fontStyle="normal"
          fontWeight="500"
          lineHeight="120%"
          display="flex"
          padding="5px"
          flexDirection="column"
          alignItems="flex-start"
          gap="10px"
          backgroundColor="bgClr.NeutralColorWhite"
        >
          <Flex alignItems="center" gap="5px">
            <RepeatIcon />
          </Flex>
        </Button>
        <Button
          color="var(--grey-600, #394256)"
          textAlign="center"
          fontFamily="Poppins"
          fontSize="12px"
          fontStyle="normal"
          fontWeight="500"
          lineHeight="120%"
          display="flex"
          padding="5px"
          flexDirection="column"
          alignItems="flex-start"
          gap="10px"
          backgroundColor="bgClr.NeutralColorWhite"
        >
          <Flex alignItems="center" gap="5px">
            <ChevronDownIcon />
            <Text>View: all</Text>
          </Flex>
        </Button>
        <Button
          color="var(--grey-600, #394256)"
          textAlign="center"
          fontFamily="Poppins"
          fontSize="12px"
          fontStyle="normal"
          fontWeight="500"
          lineHeight="120%"
          display="flex"
          padding="5px"
          flexDirection="column"
          alignItems="flex-start"
          gap="10px"
          backgroundColor="bgClr.Grey300"
        >
          <Flex alignItems="center" gap="5px">
            <Text>Bulk Update</Text>
          </Flex>
        </Button>
      </Flex>
    </Flex>
  );
};

export default DynamicButtons;
