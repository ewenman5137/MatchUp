import Header from "@/app/Composants/Header/page";
import SportSelector from "@/app/Composants/SportSelection/SportSelector";

export default function CreerTournoi() {
  return (
    <div>
      <Header />
      <SportSelector
        title="Créer un tournoi"
        breadcrumb="Création d’un tournoi"
        restrictionNote="Attention : Si vous organisez un tournoi, nous vous recommandons de réserver au moins 2 heures"
      />
    </div>
  );
}
