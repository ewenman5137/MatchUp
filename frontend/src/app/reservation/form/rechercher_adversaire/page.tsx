import Header from "@/app/Composants/Header/page";
import SportSelector from "@/app/Composants/SportSelection/SportSelector";

export default function RechercherAdversaire() {
  return (
    <div>
      <Header />
      <SportSelector
        title="Sélectionner un sport"
        breadcrumb="Rechercher un adversaire"
        restrictionNote="Vous ne pouvez pas être plus de 4 personnes par terrain"
      />
    </div>
  );
}
