'use client';

import { gsap } from 'gsap/dist/gsap';
import CustomEase from 'gsap/CustomEase';
import { useEffect } from 'react';

export default function GsapLogo() {
  useEffect(() => {
    // ---------- NETFLIX ANIMATION JS ---------- //
    // const m_tl = gsap.timeline();
    // m_tl.to('#M1-shadow', { opacity: 0, duration: 0.7 }, 0.1).to('#M3-shadow', { opacity: 0, duration: 1.5 }, 0.3);

    const m_tl = gsap.timeline();
    m_tl.to('#M1-shadow', { opacity: 0, duration: 0.5 }, 0.3).to('#M3-shadow', { opacity: 0, duration: 1.5 }, 0.3);

    // const n_tl = gsap.timeline();
    // n_tl.to('#N1-shadow', { opacity: 0, duration: 0.5 }, 0.3).to('#N3-shadow', { opacity: 0, duration: 1.5 }, 0.3);

    const e_ogShape = 'M255.1 171.6V208.2L250.5 208.5L250 172L255.1 171.6Z';
    const e_tl = gsap.timeline();
    e_tl
      .from('#E1-base', { morphSVG: { shape: e_ogShape, type: 'linear' }, opacity: 0, duration: 0.15 }, 0)
      .from('#E2-base', { scaleY: 0, transformOrigin: '50% 100%', duration: 0.1 }, 0.11)
      .from('#E3', { scaleX: 0, duration: 0.06 }, 0.21)
      .from('#E4', { scaleX: 0, duration: 0.18 }, 0.27)
      .to('#E1-shadow, #E2-shadow', { opacity: 0, duration: 0.8 }, 0);

    const t_tl = gsap.timeline();
    t_tl
      .from('#T1', { scaleX: 0, duration: 0.1 }, 0)
      .from('#T2-base', { scaleY: 0, duration: 0.25 }, 0.1)
      .to('#T2-shadow', { opacity: 0, duration: 0.82 });

    const f_tl = gsap.timeline();
    f_tl
      .from('#F1', { scaleX: 0, duration: 0.15 }, 0)
      .from('#F2-base', { scaleY: 0, duration: 0.33 }, 0.1)
      .from('#F3', { scaleX: 0, duration: 0.15 }, 0.28)
      .to('#F2-shadow', { opacity: 0, duration: 0.86 });

    const l_ogShape = 'M540.5 167.5L546 167.781V204.371L540.5 204.1V167.5Z';
    const l_tl = gsap.timeline();
    l_tl
      .from('#L1-base', { scaleY: 0, duration: 0.22 }, 0)
      .from('#L2', { morphSVG: { shape: l_ogShape, type: 'linear' }, opacity: 0, duration: 0.1 }, 0.2)
      .to('#L1-shadow', { opacity: 0, duration: 0.83 });

    const i_tl = gsap.timeline();
    i_tl.from('#I', { scaleY: 0, transformOrigin: '50% 100%', duration: 0.18 }, 0);

    const x1_ogShape = 'M733.1 216.8L771.5 220.8L772.5 218.5L734.5 213.5L733.1 216.8Z';
    const x2_ogShape = 'M737 0L738 2.5H777.5L776.5 0H737Z';
    const x_tl = gsap.timeline();
    x_tl
      .from('#X1', { morphSVG: { shape: x1_ogShape, type: 'linear', shapeIndex: 2 }, duration: 0.63 }, 0)
      .from('#X1', { opacity: 0, duration: 0.1 }, 0)
      .from('#X2-base', { morphSVG: { shape: x2_ogShape, type: 'linear', shapeIndex: 2 }, duration: 0.53 }, 0.11)
      .from('#X2-base', { opacity: 0, duration: 0.01 }, 0.11)
      .to('#X2-shadow', { opacity: 0, duration: 1.3 }, 0);

    //Movement Timeline
    const movement_tl = gsap.timeline();
    movement_tl.from('svg.msrnowlogo', { opacity: 0, duration: 0.7 }, 0).from(
      'svg.msrnowlogo',
      {
        xPercent: 50,
        left: '50%',
        duration: 1.9,
        ease: CustomEase.create('custom', 'M0,0,C0.358,0.144,0.098,1,1,1')
      },
      0.7
    );

    //Exit Timeline
    const exit_tl = gsap.timeline();
    exit_tl.to('svg.msrnowlogo', { opacity: 0, duration: 0.5 });

    //Master Timeline
    const master_tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    master_tl
      .add(movement_tl, 0)
      .add(m_tl, 0.7)
      // .add(n_tl, 0.7)
      .add(e_tl, 0.8)
      .add(t_tl, 1.08)
      .add(f_tl, 1.18)
      .add(l_tl, 1.33)
      .add(i_tl, 1.63)
      .add(x_tl, 1.7)
      .add(exit_tl, 6);
  }, []);

  return (
    <>
      <div className="netflix-container">
        <svg
          class="msrnowlogo"
          width="867"
          height="50"
          viewBox="0 0 867 233"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="m">
            <path id="M1-base" className="base" d="M0 232.8L37 227.8V101.6L35.1 0H0V232.8Z" />
            <path id="M1-shadow" d="M0 232.8L37 227.8V101.6L35.1 0H0V232.8Z" fill="url(#M1-shadowFill)" />
            <path id="M3-base" className="base" d="M82.6 0H119V218.4L82.6 222.3V0Z" />
            <path id="M3-shadow" d="M82.6 0H119V218.4L82.6 222.3V0Z" fill="url(#M3-shadowFill" />
            <path id="M2" className="base" d="M79.2 222.7L119 218.4L35.1 0H0L79.2 222.7Z" />
            <path id="M2" className="base" d="M79.2 222.7L119 218.4L35.1 0H0L79.2 222.7Z" />
            <defs>
              <linearGradient id="M1-shadowFill" x1="50%" y1="0%" x2="50%" y2="100%" gradientUnits="userSpaceOnUse">
                <stop className="shadow-start" offset="0%" />
                <stop className="shadow-end" offset="100%" />
              </linearGradient>
              <linearGradient id="M3-shadowFill" x1="50%" y1="100%" x2="50%" y2="0%" gradientUnits="userSpaceOnUse">
                <stop className="shadow-start" offset="0%" />
                <stop className="shadow-end" offset="100%" />
              </linearGradient>
              <linearGradient id="M1-shadowFill" x1="50%" y1="0%" x2="50%" y2="100%" gradientUnits="userSpaceOnUse">
                <stop className="shadow-start" offset="0%" />
                <stop className="shadow-end" offset="100%" />
              </linearGradient>
            </defs>
          </g>
          <g id="n">
            <path id="N1-base" className="base" d="M0 232.8L37 227.8V101.6L35.1 0H0V232.8Z" />
            <path id="N1-shadow" d="M0 232.8L37 227.8V101.6L35.1 0H0V232.8Z" fill="url(#N1-shadowFill)" />
            <path id="N3-base" className="base" d="M82.6 0H119V218.4L82.6 222.3V0Z" />
            <path id="N3-shadow" d="M82.6 0H119V218.4L82.6 222.3V0Z" fill="url(#N3-shadowFill" />
            <path id="N2" className="base" d="M79.2 222.7L119 218.4L35.1 0H0L79.2 222.7Z" />
            <defs>
              <linearGradient id="N1-shadowFill" x1="50%" y1="0%" x2="50%" y2="100%" gradientUnits="userSpaceOnUse">
                <stop className="shadow-start" offset="0%" />
                <stop className="shadow-end" offset="100%" />
              </linearGradient>
              <linearGradient id="N3-shadowFill" x1="50%" y1="100%" x2="50%" y2="0%" gradientUnits="userSpaceOnUse">
                <stop className="shadow-start" offset="0%" />
                <stop className="shadow-end" offset="100%" />
              </linearGradient>
            </defs>
          </g>
          <g id="E">
            <path id="E1-base" className="base" d="M255.1 171.6V208.2L153.6 215.8V178.5L255.1 171.6Z" />
            <path id="E1-shadow" d="M255.1 171.6V208.2L153.6 215.8V178.5L255.1 171.6Z" fill="url(#E1-shadowFill)" />
            <path id="E4" className="base" d="M239.9 85.2V121.2L153.6 121.5V85.6L239.9 85.2Z" />
            <path id="E2-base" className="base" d="M190.1 213.1L153.6 215.8V0H190.1V213.1Z" />
            <path id="E2-shadow" d="M190.1 213.1L153.6 215.8V0H190.1V213.1Z" fill="url(#E2-shadowFill)" />
            <path id="E3" className="base" d="M255 0H153.6V36.4H255V0Z" />
            <defs>
              <linearGradient id="E1-shadowFill" x1="0%" y1="50%" x2="100%" y2="50%" gradientUnits="objectBoundingBox">
                <stop className="shadow-start" offset="0%" />
                <stop className="shadow-end" offset="100%" />
              </linearGradient>
              <linearGradient id="E2-shadowFill" x1="50%" y1="0%" x2="50%" y2="40%" gradientUnits="userSpaceOnUse">
                <stop className="shadow-start" offset="0%" />
                <stop className="shadow-end" offset="100%" />
              </linearGradient>
            </defs>
          </g>
          <g id="T">
            <path id="T2-base" className="base" d="M317 0V204.6L353.4 203.2V0H317Z" />
            <path id="T2-shadow" d="M317 0V204.6L353.4 203.2V0H317Z" fill="url(#T2-shadowFill)" />
            <path id="T1" className="base" d="M391.7 0H278.7V36.4H391.7V0Z" />
            <defs>
              <linearGradient id="T2-shadowFill" x1="50%" y1="0%" x2="50%" y2="100%" gradientUnits="userSpaceOnUse">
                <stop className="shadow-start" offset="0%" />
                <stop className="shadow-end" offset="100%" />
              </linearGradient>
            </defs>
          </g>
          <g id="F">
            <path id="F3" className="base" d="M501 84H415V120H501V84Z" />
            <path id="F2-base" className="base" d="M414.8 0V202.2H451.8V0H414.8Z" />
            <path id="F2-shadow" d="M414.8 0V202.2H451.8V0H414.8Z" fill="url(#F2-shadowFill)" />
            <path id="F1" className="base" d="M516.8 0H414.8V36.4H516.8V0Z" />
            <defs>
              <linearGradient id="F2-shadowFill" x1="50%" y1="0%" x2="50%" y2="40%" gradientUnits="userSpaceOnUse">
                <stop className="shadow-start" offset="0%" />
                <stop className="shadow-end" offset="100%" />
              </linearGradient>
            </defs>
          </g>
          <g id="L">
            <path id="L1-base" className="base" d="M540.5 0H576.9V205.9L540.5 204.1V0Z" />
            <path id="L1-shadow" d="M540.5 0H576.9V205.9L540.5 204.1V0Z" fill="url(#L1-shadowFill)" />
            <path id="L2" className="base" d="M540.5 167.5L639.5 173.1V209.1L540.5 204.1V167.5Z" />
            <defs>
              <linearGradient id="L1-shadowFill" x1="50%" y1="100%" x2="50%" y2="0%" gradientUnits="userSpaceOnUse">
                <stop className="shadow-start" offset="0%" />
                <stop className="shadow-end" offset="100%" />
              </linearGradient>
            </defs>
          </g>
          <path id="I" className="base" d="M669.2 0H705.7V214.3L669.2 211.2V0Z" />
          <g id="X">
            <path id="X2-base" className="base" d="M737 0L825.1 227.2L866.8 232.8L776.5 0H737Z" />
            <path id="X2-shadow" d="M737 0L825.1 227.2L866.8 232.8L776.5 0H737Z" fill="url(#X2-shadowFill)" />
            <path id="X1" className="base" d="M733.1 216.8L771.5 220.8L866.8 0H826.7L733.1 216.8Z" />
            <defs>
              <linearGradient id="X2-shadowFill" x1="0%" y1="10%" x2="80%" y2="100%" gradientUnits="objectBoundingBox">
                <stop className="shadow-end" offset="0%" />
                <stop className="shadow-start" offset="50%" />
                <stop className="shadow-end" offset="100%" />
              </linearGradient>
            </defs>
          </g>
        </svg>
      </div>
    </>
  );
}
