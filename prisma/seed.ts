import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { name: 'Spinners', slug: 'spinners', description: 'Rotating devices with bearings', isSystem: true, children: [
    { name: 'Classic Spinner', slug: 'classic-spinner' },
    { name: 'Bar Spinner', slug: 'bar-spinner' },
    { name: 'Compact/Mini Spinner', slug: 'compact-mini-spinner' },
    { name: 'Transformable Spinner', slug: 'transformable-spinner' },
    { name: 'Precision Spinner', slug: 'precision-spinner' },
    { name: 'Gear Spinner', slug: 'gear-spinner' },
    { name: 'Top Spinner', slug: 'top-spinner' },
    { name: 'Fidget Disc', slug: 'fidget-disc' },
  ]},
  { name: 'Sliders', slug: 'sliders', description: 'Linear or multi-directional sliding motion', isSystem: true, children: [
    { name: 'Magnetic Slider', slug: 'magnetic-slider' },
    { name: 'Multi-Stage Slider', slug: 'multi-stage-slider' },
    { name: 'Linear Slider', slug: 'linear-slider' },
    { name: 'Ratchet Slider', slug: 'ratchet-slider' },
    { name: 'Curved Slider', slug: 'curved-slider' },
    { name: 'Omni-Directional Slider', slug: 'omni-directional-slider' },
    { name: 'Ceramic Ball Slider', slug: 'ceramic-ball-slider' },
    { name: 'Gear Slider', slug: 'gear-slider' },
  ]},
  { name: 'Clickers / Pushers', slug: 'clickers-pushers', description: 'Pressing buttons, surfaces, or mechanisms', isSystem: true, children: [
    { name: 'Pill Pusher', slug: 'pill-pusher' },
    { name: 'Dimpler', slug: 'dimpler' },
    { name: 'Multi-Click', slug: 'multi-click' },
    { name: 'Tactile Switch', slug: 'tactile-switch' },
    { name: 'Snap Click', slug: 'snap-click' },
    { name: 'Piston Pusher', slug: 'piston-pusher' },
    { name: 'Platform Clicker', slug: 'platform-clicker' },
  ]},
  { name: 'Rockers', slug: 'rockers', description: 'Tilting/rocking over a fulcrum', isSystem: true, children: [
    { name: 'See-Saw Rocker', slug: 'see-saw-rocker' },
    { name: 'Magnetic Rocker', slug: 'magnetic-rocker' },
    { name: 'Weighted Rocker', slug: 'weighted-rocker' },
    { name: 'Pivot Rocker', slug: 'pivot-rocker' },
  ]},
  { name: 'Cubes & Multi-Function', slug: 'cubes-multi-function', description: 'Multiple fidget types in one device', isSystem: true, children: [
    { name: 'Fidget Cube', slug: 'fidget-cube' },
    { name: 'Fidget Pad', slug: 'fidget-pad' },
    { name: 'Infinity Cube', slug: 'infinity-cube' },
    { name: 'Shape-Shifting Cube', slug: 'shape-shifting-cube' },
  ]},
  { name: 'Bolt Actions', slug: 'bolt-actions', description: 'Cocking/sliding bolt mechanism', isSystem: true, children: [
    { name: 'Linear Bolt', slug: 'linear-bolt' },
    { name: 'Rotary Bolt', slug: 'rotary-bolt' },
    { name: 'Tactical Bolt', slug: 'tactical-bolt' },
  ]},
  { name: 'Coins & Discs', slug: 'coins-discs', description: 'Flipping, rubbing, pressing flat objects', isSystem: true, children: [
    { name: 'Worry Coin', slug: 'worry-coin' },
    { name: 'Haptic Coin', slug: 'haptic-coin' },
    { name: 'Spinning Coin', slug: 'spinning-coin' },
    { name: 'Press Coin', slug: 'press-coin' },
    { name: 'Slider Coin', slug: 'slider-coin' },
  ]},
  { name: 'Rollers', slug: 'rollers', description: 'Rolling/orbiting motion', isSystem: true, children: [
    { name: 'Orbital Roller', slug: 'orbital-roller' },
    { name: 'Frictionless Roller', slug: 'frictionless-roller' },
    { name: 'Thumb Roller', slug: 'thumb-roller' },
    { name: 'Marble Roller', slug: 'marble-roller' },
  ]},
  { name: 'Twistables', slug: 'twistables', description: 'Twisting, bending, looping', isSystem: true, children: [
    { name: 'Tangle', slug: 'tangle' },
    { name: 'Wacky Tracks', slug: 'wacky-tracks' },
    { name: 'Flexible Chain', slug: 'flexible-chain' },
    { name: 'Twist Lock', slug: 'twist-lock' },
  ]},
  { name: 'Squishables', slug: 'squishables', description: 'Squeezing, compressing', isSystem: true, children: [
    { name: 'Stress Ball', slug: 'stress-ball' },
    { name: 'Slow-Rise Foam', slug: 'slow-rise-foam' },
    { name: 'Squishy Toy', slug: 'squishy-toy' },
    { name: 'Putty', slug: 'putty' },
    { name: 'Sensory Ball', slug: 'sensory-ball' },
  ]},
  { name: 'Bead & String', slug: 'bead-string', description: 'Manipulating beads on string/chain', isSystem: true, children: [
    { name: 'Begleri', slug: 'begleri' },
    { name: 'Worry Beads', slug: 'worry-beads' },
    { name: 'Flippy Chain', slug: 'flippy-chain' },
    { name: 'Baoding Balls', slug: 'baoding-balls' },
  ]},
  { name: 'Mechanical / Specialty', slug: 'mechanical-specialty', description: 'Complex or unique mechanisms', isSystem: true, children: [
    { name: 'Piston', slug: 'piston' },
    { name: 'Gyroscope', slug: 'gyroscope' },
    { name: 'Spring', slug: 'spring' },
    { name: 'Pop Mechanism', slug: 'pop-mechanism' },
    { name: 'Zipper', slug: 'zipper' },
    { name: 'Lanyard Snapper', slug: 'lanyard-snapper' },
  ]},
];

async function main() {
  console.log('Seeding categories...');
  
  for (const cat of categories) {
    const parent = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        isSystem: cat.isSystem,
      },
    });
    
    if (cat.children) {
      for (const child of cat.children) {
        await prisma.category.create({
          data: {
            name: child.name,
            slug: child.slug,
            parentId: parent.id,
          },
        });
      }
    }
  }
  
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
