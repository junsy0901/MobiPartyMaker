import { toBlob } from "html-to-image";

export async function exportToImage(element: HTMLElement): Promise<void> {
  try {
    // 클립보드 API 지원 확인
    if (!navigator.clipboard || !navigator.clipboard.write) {
      throw new Error("클립보드 API를 지원하지 않는 브라우저입니다.");
    }

    // ClipboardItem 지원 확인
    if (typeof ClipboardItem === "undefined") {
      throw new Error("이미지 클립보드 복사를 지원하지 않는 브라우저입니다. Chrome, Edge, Opera 최신 버전을 사용해주세요.");
    }

    // html-to-image로 요소를 Blob으로 변환
    const blob = await toBlob(element, {
      backgroundColor: "#0a0a15",
      pixelRatio: 2, // 고해상도
      skipFonts: true, // 폰트 로딩 문제 방지
      filter: (_node) => {
        // 불필요한 요소 필터링 (필요시)
        return true;
      },
    });

    if (!blob) {
      throw new Error("이미지 생성에 실패했습니다.");
    }

    // ClipboardItem에 Promise로 전달 (일부 브라우저에서 필요)
    try {
      const clipboardItem = new ClipboardItem({
        "image/png": Promise.resolve(blob),
      });
      await navigator.clipboard.write([clipboardItem]);
    } catch (clipboardError) {
      console.error("클립보드 복사 실패:", clipboardError);
      // 더 자세한 에러 메시지 제공
      if (clipboardError instanceof DOMException) {
        if (clipboardError.name === "NotAllowedError") {
          throw new Error("클립보드 권한이 거부되었습니다. 브라우저 설정에서 클립보드 권한을 허용해주세요.");
        }
        if (clipboardError.name === "DataError") {
          throw new Error("클립보드 데이터 형식 오류가 발생했습니다.");
        }
      }
      throw new Error(`클립보드 복사 실패: ${clipboardError instanceof Error ? clipboardError.message : String(clipboardError)}`);
    }
  } catch (error) {
    console.error("이미지 내보내기 실패:", error);
    // 이미 에러 메시지가 설정된 경우 그대로 전달
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("이미지 내보내기에 실패했습니다.");
  }
}
