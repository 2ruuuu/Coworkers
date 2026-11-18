import TeamCard from '../_components/TeamCard';
import TeamForm from '../_components/TeamForm';

const AddTeamPage = () => {
  return (
    <TeamCard>
      <TeamForm mode="create" />
    </TeamCard>
  );
};

export default AddTeamPage;
