import React, { useCallback, forwardRef } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProps,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";

// 1. props 정의: ref는 따로 처리하므로 Props 인터페이스에서는 제외하는 것이 일반적입니다.
interface BottomSheetProps extends Omit<BottomSheetModalProps, "children"> {
  children: React.ReactNode;
}

// 2. forwardRef로 감싸기: <접근하려는 타입, 전달받을 Props 타입>
const BottomSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
  ({ children, ...props }, ref) => {
    // Backdrop 설정: 뒷배경을 어둡게 하고 터치 시 닫히게 함
    const renderBackdrop = useCallback(
      (backdropProps: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...backdropProps}
          disappearsOnIndex={-1} // 완전히 닫혔을 때 (인덱스 -1)
          appearsOnIndex={0} // 첫 번째 snapPoint가 보일 때 (인덱스 0)
          pressBehavior="close" // 배경 터치 시 닫힘
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref} // 부모로부터 전달받은 ref를 여기에 연결!
        backdropComponent={renderBackdrop}
        // snapPoints가 전달되지 않았을 경우를 대비한 기본값
        snapPoints={props.snapPoints}
        {...props}
      >
        <BottomSheetView style={{ flex: 1 }}>{children}</BottomSheetView>
      </BottomSheetModal>
    );
  },
);

// 컴포넌트 이름 설정 (디버깅용)
BottomSheet.displayName = "BottomSheet";

export default BottomSheet;
