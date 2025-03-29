import Header from "@/app/Composants/Header/page";
import SportSelector from "@/app/Composants/SportSelection/SportSelector";

export default function JouerEntreAmis() {
  return (
    <div>
      <Header />
      <SportSelector
        title="Sélectionner un sport"
        breadcrumb="Jouer entre amis"
        restrictionNote="Vous ne pouvez pas être plus de 4 personnes par terrain"
      />
    </div>
  );
}
