import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import '../../constants/app_colors.dart';
import '../../models/onboarding_model.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          PageView.builder(
            controller: _pageController,
            itemCount: OnboardingModel.onboardingData.length,
            itemBuilder: (context, index) {
              final page = OnboardingModel.onboardingData[index];
              return Container(
                decoration: BoxDecoration(
                  // Image en background avec un overlay
                  image: DecorationImage(
                    image: AssetImage(page.image),
                    fit: BoxFit.cover,
                  ),
                  // Overlay gradient pour meilleure lisibilité
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Colors.black.withOpacity(0.7),
                    ],
                  ),
                ),
                child: Column(
                  children: [
                    const Spacer(flex: 3), // Pousse le contenu vers le bas
                    
                    // Contenu principal (titre et description)
                    Expanded(
                      flex: 2,
                      child: Padding(
                        padding: EdgeInsets.symmetric(horizontal: 24.w),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            Text(
                              page.title,
                              style: TextStyle(
                                fontSize: 24.sp, // Taille réduite
                                fontWeight: FontWeight.w600,
                                color: AppColors.white,
                                height: 1.2,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            SizedBox(height: 12.h),
                            Text(
                              page.description,
                              style: TextStyle(
                                fontSize: 14.sp, // Taille réduite
                                color: AppColors.white.withOpacity(0.8),
                                height: 1.5,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      ),
                    ),

                    // Bouton et indicateurs
                    Padding(
                      padding: EdgeInsets.only(
                        left: 24.w,
                        right: 24.w,
                        bottom: 48.h,
                      ),
                      child: Column(
                        children: [
                          SizedBox(height: 32.h),
                          ElevatedButton(
                            onPressed: () {
                              if (index == OnboardingModel.onboardingData.length - 1) {
                                Navigator.pushReplacementNamed(context, '/live');
                              } else {
                                _pageController.nextPage(
                                  duration: const Duration(milliseconds: 300),
                                  curve: Curves.easeInOut,
                                );
                              }
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.white,
                              foregroundColor: AppColors.black,
                              minimumSize: Size(200.w, 56.h),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(28.r),
                              ),
                            ),
                            child: Text(
                              page.buttonText,
                              style: TextStyle(
                                fontSize: 16.sp,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                          SizedBox(height: 24.h),
                          SmoothPageIndicator(
                            controller: _pageController,
                            count: OnboardingModel.onboardingData.length,
                            effect: ExpandingDotsEffect(
                              dotHeight: 8.h,
                              dotWidth: 8.w,
                              spacing: 8.w,
                              expansionFactor: 4,
                              activeDotColor: AppColors.white,
                              dotColor: AppColors.white.withOpacity(0.5),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
          
          // Bouton "Passer" en haut à droite
          Positioned(
            top: MediaQuery.of(context).padding.top + 16.h,
            right: 24.w,
            child: TextButton(
              onPressed: () {
                Navigator.pushReplacementNamed(context, '/live');
              },
              style: TextButton.styleFrom(
                backgroundColor: Colors.black.withOpacity(0.3),
                padding: EdgeInsets.symmetric(
                  horizontal: 16.w,
                  vertical: 8.h,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20.r),
                ),
              ),
              child: Text(
                'Passer',
                style: TextStyle(
                  color: AppColors.white,
                  fontSize: 14.sp,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }
} 