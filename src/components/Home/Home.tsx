'use client'

import {
  faBolt,
  faClockRotateLeft,
  faCode,
  faCodeBranch,
  faEye,
  faInfinity,
  faLayerGroup,
  faSyncAlt,
  faUnlockKeyhole,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

import { DonateButton } from '../DonateButton'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'

const Home = () => {
  const t = useTranslations('home')
  const locale = useLocale()
  const isThai = locale === 'th'

  const HOW_IT_WORKS = [
    { step: '1', title: t('howItWorks.step1Title'), description: t('howItWorks.step1Desc') },
    { step: '2', title: t('howItWorks.step2Title'), description: t('howItWorks.step2Desc') },
    { step: '3', title: t('howItWorks.step3Title'), description: t('howItWorks.step3Desc') },
  ]

  const FEATURES = [
    { icon: faInfinity, title: t('why.freeTitle'), description: t('why.freeDesc') },
    { icon: faUnlockKeyhole, title: t('why.noRegTitle'), description: t('why.noRegDesc') },
    { icon: faBolt, title: t('why.realtimeTitle'), description: t('why.realtimeDesc') },
    { icon: faLayerGroup, title: t('why.customTitle'), description: t('why.customDesc') },
    { icon: faSyncAlt, title: t('why.crossPlatformTitle'), description: t('why.crossPlatformDesc') },
    { icon: faEye, title: t('why.spectatorTitle'), description: t('why.spectatorDesc') },
    { icon: faBolt, title: t('why.interactiveTitle'), description: t('why.interactiveDesc') },
    {
      icon: faCode,
      title: t('why.openSourceTitle'),
      description: t('why.openSourceDesc'),
      link: { href: 'https://github.com/raksitnongbua/planning-poker', label: t('why.viewOnGitHub') },
    },
  ]

  const FAQS = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
    { q: t('faq.q6'), a: t('faq.a6') },
  ]

  return (
    <>
      {/* Hero */}
      <div className="mx-auto flex min-h-[calc(100dvh-92px*2)] max-w-[1100px] items-center justify-center">
        <div className="duration-700 animate-in fade-in slide-in-from-bottom-6">
          <div className="my-5 grid max-w-[500px] gap-4">
            <h1 className={`leading-tight tracking-tighter ${isThai ? 'font-medium text-5xl md:text-6xl' : 'font-bold text-7xl'}`}>
              <span
                className="duration-600 inline-block text-primary drop-shadow-[0_0_12px_hsl(var(--primary)/0.6)] animate-in fade-in slide-in-from-left-8"
                style={{ animationFillMode: 'both' }}
              >
                {t('hero.free')}
              </span>
              <br />
              <span
                className="duration-600 inline-block animate-in fade-in slide-in-from-bottom-6"
                style={{ animationDelay: '150ms', animationFillMode: 'both' }}
              >
                {t('hero.online')}
              </span>{' '}
              <span
                className="duration-600 inline-block animate-in fade-in slide-in-from-right-8"
                style={{ animationDelay: '300ms', animationFillMode: 'both' }}
              >
                {t('hero.planningPoker')}
              </span>
            </h1>
            <h2
              className="text-lg font-light duration-500 animate-in fade-in slide-in-from-bottom-3"
              style={{ animationDelay: '500ms', animationFillMode: 'both' }}
            >
              {t('hero.subtitle')}
            </h2>
          </div>
          <div
            className="flex gap-2"
            style={{ animationDelay: '700ms', animationFillMode: 'both' }}
          >
            <div className="relative">
              {/* Glow halo */}
              <div
                className="absolute inset-[-4px] animate-pulse rounded-lg bg-primary/40 blur-xl"
                style={{ animationDuration: '2s' }}
              />
              {/* Shine + button */}
              <div className="relative overflow-hidden rounded-md">
                <span
                  className="pointer-events-none absolute inset-0 z-10 animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{ animationDuration: '3s' }}
                />
                <Button
                  asChild
                  className="relative h-11 w-52 border-0 bg-gradient-to-r from-orange-500 via-primary to-orange-400 transition-transform duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/40"
                  style={{
                    backgroundSize: '200% 200%',
                    animation: 'gradient-shift 4s ease infinite',
                  }}
                >
                  <Link href="/new-room">{t('hero.createRoom')}</Link>
                </Button>
              </div>
            </div>
            <Button
              asChild
              variant="secondary"
              className="h-11 gap-2 px-4 transition-transform duration-200 hover:scale-[1.03]"
              id="button-recent-rooms"
              aria-label="Recent Rooms"
            >
              <Link href="/recent-rooms">
                <FontAwesomeIcon
                  icon={faClockRotateLeft}
                  className="size-4 animate-shake"
                  style={{ animationDuration: '2.5s' }}
                />
                {t('hero.resumeRoom')}
              </Link>
            </Button>
          </div>
        </div>
        <div className="hidden duration-700 animate-in fade-in slide-in-from-right-10 lg:block">
          <Image
            src="/images/corgi-banner.png"
            className="animate-sway lg:h-[477px] lg:w-[600px]"
            style={{ animationDuration: '8s' }}
            alt="Free online planning poker — agile estimation tool illustration"
            priority={true}
            width={600}
            height={477}
          />
        </div>
      </div>

      {/* Content sections */}
      <section className="mx-auto max-w-[1100px] space-y-20 pb-24 pt-4">
        {/* What is Planning Poker? */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-2xl font-semibold">
            <span className="inline-block size-2 animate-pulse rounded-full bg-primary" />
            {t('whatIs.heading')}
          </h2>
          <div className="space-y-3 border-l-2 border-primary pl-5 transition-all duration-300 hover:[box-shadow:-3px_0_16px_hsl(var(--primary)/0.35)]">
            <p className="leading-relaxed text-muted-foreground">
              {t('whatIs.p1')}
            </p>
            <p className="leading-relaxed text-muted-foreground">
              {t.rich('whatIs.p2', { book: (chunks) => <em key="book">{chunks}</em> })}
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-semibold">
            <span className="inline-block size-2 animate-pulse rounded-full bg-primary" />
            {t('howItWorks.heading')}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {HOW_IT_WORKS.map(({ step, title, description }, i) => (
              <Card
                key={step}
                className="transition-shadow duration-500 animate-in fade-in slide-in-from-bottom-4 hover:shadow-md"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
              >
                <CardContent className="pt-6">
                  <div className="relative mb-4 inline-flex">
                    <span className="absolute inline-flex size-full animate-aura rounded-full bg-primary" />
                    <div className="relative flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {step}
                    </div>
                  </div>
                  <h3 className="mb-2 font-semibold">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Use Corgi Planning Poker? */}
        <div className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-semibold">
            <span className="inline-block size-2 animate-pulse rounded-full bg-primary" />
            {t('why.heading')}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon, title, description, link }, i) => (
              <Card
                key={title}
                className="group transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 hover:border-primary/30 hover:shadow-md"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
              >
                <CardContent className="pt-6">
                  <div className="relative mb-3 flex size-11 items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <span
                      className="absolute inset-0 animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,transparent_25%,hsl(var(--primary)/0.3)_60%,hsl(var(--primary))_100%)]"
                      style={{ animationDuration: '3s' }}
                    />
                    <div className="relative z-10 flex size-9 items-center justify-center rounded-full bg-background">
                      <div className="flex size-full items-center justify-center rounded-full bg-primary/10">
                        <FontAwesomeIcon icon={icon} className="size-4 text-primary" />
                      </div>
                    </div>
                  </div>
                  <h3 className="mb-1 font-semibold">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                    {link && (
                      <>
                        {' '}
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          {link.label}
                        </a>
                      </>
                    )}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Our Story */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-2xl font-semibold">
            <span className="inline-block size-2 animate-pulse rounded-full bg-primary" />
            {t('story.heading')}
          </h2>
          <div className="space-y-4 rounded-xl border border-border/40 bg-muted/20 px-6 py-6">
            <p className="leading-relaxed text-muted-foreground">
              {t('story.p1')}
            </p>
            <p className="leading-relaxed text-muted-foreground">
              {t('story.p2')}
            </p>
            <p className="leading-relaxed text-muted-foreground">
              {t.rich('story.p3', {
                kimi: (chunks) => (
                  <a
                    key="kimi"
                    href="https://www.instagram.com/kimicorgi_?igsh=MWc4bjRneHg4NmdjaA=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
            <p className="text-sm italic text-muted-foreground/70">{t('story.signature')}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t.rich('story.support', {
                link: (chunks) => (
                  <a
                    key="link"
                    href="https://ko-fi.com/raksitnongbua"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {chunks}
                  </a>
                ),
                supportLink: t('story.supportLink'),
              })}
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-6">
          <h2 className="flex items-center gap-2 text-2xl font-semibold">
            <span className="inline-block size-2 animate-pulse rounded-full bg-primary" />
            {t('faq.heading')}
          </h2>
          <div className="divide-y divide-border overflow-hidden rounded-xl border">
            {FAQS.map(({ q, a }) => (
              <div
                key={q}
                className="group cursor-default px-5 py-4 transition-colors duration-200 hover:bg-primary/5"
              >
                <h3 className="font-semibold transition-colors duration-200 group-hover:text-primary">
                  {q}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{a}</p>
              </div>
            ))}
            <div className="group cursor-default px-5 py-4 transition-colors duration-200 hover:bg-primary/5">
              <h3 className="font-semibold transition-colors duration-200 group-hover:text-primary">
                {t('faq.q7')}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {t.rich('faq.a7', { em: (chunks) => <em key="em">{chunks}</em> })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source */}
      <section className="mx-auto max-w-[1100px] pb-4">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
          <span className="inline-block size-2 animate-pulse rounded-full bg-primary" />
          {t('openSource.heading')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Open an Issue */}
          <div className="flex flex-col gap-4 rounded-2xl border border-border/40 bg-muted/20 p-6 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10">
              <FontAwesomeIcon icon={faBolt} className="size-4 text-primary" />
            </div>
            <div className="space-y-1.5">
              <p className="font-semibold">{t('openSource.bugTitle')}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t('openSource.bugDesc')}
              </p>
            </div>
            <a
              href="https://github.com/raksitnongbua/planning-poker/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              <FontAwesomeIcon icon={faBolt} className="size-3" />
              {t('openSource.bugCta')}
            </a>
          </div>

          {/* Contribute */}
          <div className="flex flex-col gap-4 rounded-2xl border border-border/40 bg-muted/20 p-6 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10">
              <FontAwesomeIcon icon={faCodeBranch} className="size-4 text-primary" />
            </div>
            <div className="space-y-1.5">
              <p className="font-semibold">{t('openSource.contributeTitle')}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t('openSource.contributeDesc')}
              </p>
            </div>
            <a
              href="https://github.com/raksitnongbua/planning-poker/pulls"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <FontAwesomeIcon icon={faCodeBranch} className="size-3" />
              {t('openSource.contributeCta')}
            </a>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 transition-all duration-200 hover:border-primary/40 hover:bg-primary/10">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-xl">
              🦴
            </div>
            <div className="space-y-1.5">
              <p className="font-semibold">{t('openSource.supportTitle')}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t('openSource.supportDesc')}
              </p>
            </div>
            <div className="mt-auto">
              <DonateButton />
            </div>
          </div>
        </div>
      </section>

      {/* Explore More */}
      <section className="mx-auto max-w-[1100px] pb-24">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
          <span className="inline-block size-2 animate-pulse rounded-full bg-primary" />
          {t('exploreMore')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/scrum-poker" className="group flex flex-col gap-2 rounded-xl border border-border/40 bg-muted/20 p-5 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5">
            <p className="font-semibold transition-colors group-hover:text-primary">{t('exploreLinks.scrumPokerTitle')}</p>
            <p className="text-sm text-muted-foreground">{t('exploreLinks.scrumPokerDesc')}</p>
          </Link>
          <Link href="/agile-estimation" className="group flex flex-col gap-2 rounded-xl border border-border/40 bg-muted/20 p-5 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5">
            <p className="font-semibold transition-colors group-hover:text-primary">{t('exploreLinks.agileToolTitle')}</p>
            <p className="text-sm text-muted-foreground">{t('exploreLinks.agileToolDesc')}</p>
          </Link>
          <Link href="/story-points-estimator" className="group flex flex-col gap-2 rounded-xl border border-border/40 bg-muted/20 p-5 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5">
            <p className="font-semibold transition-colors group-hover:text-primary">{t('exploreLinks.storyEstimatorTitle')}</p>
            <p className="text-sm text-muted-foreground">{t('exploreLinks.storyEstimatorDesc')}</p>
          </Link>
          <Link href="/sprint-planning" className="group flex flex-col gap-2 rounded-xl border border-border/40 bg-muted/20 p-5 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5">
            <p className="font-semibold transition-colors group-hover:text-primary">{t('exploreLinks.sprintPlanningTitle')}</p>
            <p className="text-sm text-muted-foreground">{t('exploreLinks.sprintPlanningDesc')}</p>
          </Link>
          <Link href="/blog" className="group flex flex-col gap-2 rounded-xl border border-border/40 bg-muted/20 p-5 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5">
            <p className="font-semibold transition-colors group-hover:text-primary">{t('exploreLinks.blogTitle')}</p>
            <p className="text-sm text-muted-foreground">{t('exploreLinks.blogDesc')}</p>
          </Link>
          <Link href="/blog/handling-outliers-in-planning-poker" className="group flex flex-col gap-2 rounded-xl border border-border/40 bg-muted/20 p-5 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5">
            <p className="font-semibold transition-colors group-hover:text-primary">{t('exploreLinks.outliersTitle')}</p>
            <p className="text-sm text-muted-foreground">{t('exploreLinks.outliersDesc')}</p>
          </Link>
          <Link href="/blog/how-to-make-story-points-effective" className="group flex flex-col gap-2 rounded-xl border border-border/40 bg-muted/20 p-5 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5">
            <p className="font-semibold transition-colors group-hover:text-primary">{t('exploreLinks.effectivePointsTitle')}</p>
            <p className="text-sm text-muted-foreground">{t('exploreLinks.effectivePointsDesc')}</p>
          </Link>
        </div>
      </section>
    </>
  )
}

export default Home
