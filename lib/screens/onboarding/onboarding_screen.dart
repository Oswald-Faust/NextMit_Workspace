import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import '../../constants/app_colors.dart';
import '../../constants/app_strings.dart';
import '../../models/onboarding_model.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          PageView.builder(
            controller: _pageController,
            onPageChanged: (index) {
              setState(() {
                _currentPage = index;
              });
            },
            itemCount: OnboardingModel.onboardingData.length,
            itemBuilder: (context, index) {
              final data = OnboardingModel.onboardingData[index];
              return Container(
                decoration: BoxDecoration(
                  color: Color(int.parse(data.backgroundColor.replaceAll('#', '0xFF'))),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Expanded(
                      flex: 2,
                      child: Container(
                        margin: EdgeInsets.only(top: 50.h),
                        child: Center(
                          child: Text(
                            "Image Placeholder",
                            style: TextStyle(
                              color: AppColors.white,
                              fontSize: 20.sp,
                            ),
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      flex: 1,
                      child: Padding(
                        padding: EdgeInsets.symmetric(horizontal: 24.w),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              data.title,
                              style: TextStyle(
                                fontSize: 24.sp,
                                fontWeight: FontWeight.bold,
                                color: AppColors.white,
                                fontFamily: 'Poppins',
                              ),
                              textAlign: TextAlign.center,
                            ),
                            SizedBox(height: 16.h),
                            Text(
                              data.description,
                              style: TextStyle(
                                fontSize: 16.sp,
                                color: AppColors.white.withOpacity(0.7),
                                fontFamily: 'Poppins',
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
          Positioned(
            bottom: 50.h,
            left: 0,
            right: 0,
            child: Column(
              children: [
                SmoothPageIndicator(
                  controller: _pageController,
                  count: OnboardingModel.onboardingData.length,
                  effect: ExpandingDotsEffect(
                    dotColor: AppColors.white.withOpacity(0.3),
                    activeDotColor: AppColors.white,
                    dotHeight: 8.h,
                    dotWidth: 8.w,
                    expansionFactor: 4,
                  ),
                ),
                SizedBox(height: 24.h),
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 24.w),
                  child: ElevatedButton(
                    onPressed: () {
                      if (_currentPage < OnboardingModel.onboardingData.length - 1) {
                        _pageController.nextPage(
                          duration: const Duration(milliseconds: 300),
                          curve: Curves.easeIn,
                        );
                      } else {
                        // TODO: Navigate to home screen
                        debugPrint('Navigate to home screen');
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.white,
                      minimumSize: Size(double.infinity, 56.h),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16.r),
                      ),
                    ),
                    child: Text(
                      OnboardingModel.onboardingData[_currentPage].buttonText,
                      style: TextStyle(
                        fontSize: 18.sp,
                        fontWeight: FontWeight.w600,
                        color: Color(int.parse(
                          OnboardingModel.onboardingData[_currentPage]
                              .backgroundColor
                              .replaceAll('#', '0xFF'),
                        )),
                        fontFamily: 'Poppins',
                      ),
                    ),
                  ),
                ),
              ],
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