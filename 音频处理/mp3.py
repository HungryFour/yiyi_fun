from pydub import AudioSegment
import os
from typing import List, Union
from pathlib import Path
import logging

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def split_mp3_by_milliseconds(
    file_path: Union[str, Path],
    output_folder: Union[str, Path],
    split_points: List[int]
) -> None:
    """
    根据给定的毫秒数组切分 MP3 文件，并按照源文件名命名输出文件。

    Args:
        file_path: 输入的 MP3 文件路径
        output_folder: 输出文件夹路径
        split_points: 每个片段的时长数组（毫秒值，例如 [3230, 3230, 3230]）

    Raises:
        FileNotFoundError: 当输入文件不存在时
        ValueError: 当切分点无效时
        Exception: 处理音频文件时可能出现的其他错误
    """
    try:
        # 转换为 Path 对象
        file_path = Path(file_path)
        output_folder = Path(output_folder)

        # 验证输入文件是否存在
        if not file_path.exists():
            raise FileNotFoundError(f"输入文件不存在: {file_path}")

        # 确保输出文件夹存在
        output_folder.mkdir(parents=True, exist_ok=True)

        # 获取源文件名（不包含扩展名）
        base_name = file_path.stem

        # 加载 MP3 文件
        logger.info(f"正在加载音频文件: {file_path}")
        audio = AudioSegment.from_mp3(str(file_path))
        total_length = len(audio)

        # 计算实际的切分点（累加时长）
        actual_split_points = []
        current_point = 0
        for duration in split_points:
            current_point += duration
            if current_point > total_length:
                logger.warning(f"警告：切分点 {current_point} 超出音频总长度 {total_length}")
                break
            actual_split_points.append(current_point)

        # 验证切分点
        if not actual_split_points:
            raise ValueError("没有有效的切分点")

        # 添加起始点
        actual_split_points = [0] + actual_split_points

        # 切分音频
        total_segments = len(actual_split_points) - 1
        logger.info(f"开始切分音频，共 {total_segments} 段")

        for i in range(total_segments):
            start_time = actual_split_points[i]
            end_time = actual_split_points[i + 1]
            segment = audio[start_time:end_time]
            
            # 生成输出文件名
            output_file_name = f"{base_name}_letter_{i + 1}.mp3"
            output_path = output_folder / output_file_name
            
            # 导出音频段
            segment.export(str(output_path), format="mp3")
            logger.info(f"已完成第 {i + 1}/{total_segments} 段的处理，时长: {end_time - start_time}ms")

        logger.info(f"音频切分完成，所有文件已保存至: {output_folder}")

    except Exception as e:
        logger.error(f"处理音频时发生错误: {str(e)}")
        raise

def main():
    """主函数，用于演示代码使用"""
    try:
        input_file = "我要吃A饼干.mp3"
        output_directory = "output_segments"
        # split_points 是每个字母的时长，单位是毫秒
        split_points = [2900] + [2800] * 25
        logger.info(f"总片段数: {len(split_points)}")
        split_mp3_by_milliseconds(input_file, output_directory, split_points)
    except Exception as e:
        logger.error(f"程序执行失败: {str(e)}")
        raise

if __name__ == "__main__":
    main()