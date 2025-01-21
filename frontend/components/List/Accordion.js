import { ListItem } from '@rneui/themed';
import EumcText from '../EumcText';

const { useState } = require('react');

const Accordion = ({ title, titleStyle, activeTitleStyle, children }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <ListItem.Accordion
      containerStyle={{ padding: 6 }}
      content={
        <ListItem.Content>
          <ListItem.Title>
            <EumcText style={expanded ? activeTitleStyle : titleStyle} fontWeight="bold">
              {title}
            </EumcText>
          </ListItem.Title>
        </ListItem.Content>
      }
      isExpanded={expanded}
      onPress={() => setExpanded(!expanded)}
    >
      {children}
    </ListItem.Accordion>
  );
};

export default Accordion;
