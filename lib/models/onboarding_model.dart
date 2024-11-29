class OnboardingModel {
  final String title;
  final String description;
  final String image;
  final String buttonText;
  final String backgroundColor;

  OnboardingModel({
    required this.title,
    required this.description,
    required this.image,
    required this.buttonText,
    required this.backgroundColor,
  });

  static List<OnboardingModel> onboardingData = [
    OnboardingModel(
      title: "À l'origine il s'agissait d'une hypothèse de startup",
      description: "selon laquelle le pur plaisir est aussi simple que la vie",
      image: "assets/images/onboarding1.png",
      buttonText: "Bouffe!",
      backgroundColor: "#6A1B9A",
    ),
    OnboardingModel(
      title: "Un grand resto ou une soirée entre amis",
      description: "n'importe où vous en avez envie sans la file",
      image: "assets/images/onboarding2.png",
      buttonText: "Pois!",
      backgroundColor: "#D32F2F",
    ),
    OnboardingModel(
      title: "Le bonheur d'après le soir",
      description: "après avoir fini l'intégralité du festival dans la joie, toute bonne est la fête",
      image: "assets/images/onboarding3.png",
      buttonText: "Explore!",
      backgroundColor: "#1565C0",
    ),
    OnboardingModel(
      title: "La meilleure finance la meilleure économie",
      description: "assurées au plaisir et à la confiance New Fair 45",
      image: "assets/images/onboarding4.png",
      buttonText: "Dance!",
      backgroundColor: "#F57C00",
    ),
  ];
} 