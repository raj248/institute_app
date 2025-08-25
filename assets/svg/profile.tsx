import * as React from 'react';
import Svg, { SvgProps, Defs, ClipPath, Path, G } from 'react-native-svg';

interface IconProps extends SvgProps {
  focused?: boolean;
}

const Icon = React.forwardRef<Svg, IconProps>(({ focused = false, ...props }, ref) => {
  return (
    <Svg width={1024} height={1024} viewBox="0 0 768 768" ref={ref} {...props}>
      <Defs>
        <ClipPath id="a">
          <Path d="M98.742 428h570.75v333H98.742Zm0 0" />
        </ClipPath>
      </Defs>
      <Path
        d="M383.973 7.328c-101.77 0-185.02 82.918-185.02 184.52 0 101.597 83.25 184.515 185.02 184.515 101.765 0 185.015-82.918 185.015-184.515 0-101.602-83.25-184.52-185.015-184.52Zm0 60.945c68.941 0 124.07 55.012 124.07 123.575 0 68.558-55.129 123.582-124.07 123.582-68.942 0-124.086-55.024-124.086-123.582 0-68.563 55.144-123.575 124.086-123.575Zm0 0"
        fill={focused ? '#3f3d91' : '#070101'}
        fillRule="nonzero"
      />
      <G clipPath="url(#a)">
        <Path
          d="M264.898 428.516c-91.48 0-166.086 74.601-166.086 166.086 0 91.48 74.606 166.07 166.086 166.07h238.133c91.485 0 166.086-74.59 166.086-166.07 0-91.485-74.601-166.086-166.086-166.086Zm0 60.93h238.133c58.781 0 105.156 46.374 105.156 105.156 0 58.777-46.375 105.14-105.156 105.14H264.898c-58.78 0-105.14-46.363-105.14-105.14 0-58.782 46.36-105.157 105.14-105.157Zm0 0"
          fill={focused ? '#3f3d91' : '#070101'}
          fillRule="nonzero"
          stroke="none"
        />
      </G>
    </Svg>
  );
});

export default Icon;
